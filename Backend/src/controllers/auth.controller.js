const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🚨 REMOVED the old MongoDB tokenBlacklistModel
// 🚀 ADDED the new Redis Client (Adjust the path if your redis.js is in a different folder)
const redisClient = require("../config/redis"); 

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        //search for user with the same email or username
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        });
    }

    const hash = await bcrypt.hash(password, 10); //hash the password with a salt of 10 rounds

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in Redis blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    // 1. Get token from cookies OR headers (Matches our new middleware logic)
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            // 2. Decode the token to find its expiration time
            const decoded = jwt.decode(token);
            
            if (decoded && decoded.exp) {
                // 3. Calculate how many seconds until it naturally expires
                const currentTime = Math.floor(Date.now() / 1000);
                const timeLeft = decoded.exp - currentTime;

                // 4. Save to Redis with a self-destruct timer (TTL)
                if (timeLeft > 0) {
                    await redisClient.setEx(`blacklist:${token}`, timeLeft, "true");
                }
            }
        } catch (error) {
            console.error("Redis Logout Error:", error);
            // We log the error but continue, so the user's cookie still gets cleared
        }
    }

    // 5. Clear the cookie from the browser
    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    });
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};