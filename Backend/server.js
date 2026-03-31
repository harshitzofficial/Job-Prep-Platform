require("dotenv").config()
const app = require("./src/app") //imports your actual Express application
const connectToDB = require("./src/config/database")//imports a function designed to talk to your database

connectToDB()


//It tells your app to stay awake and watch Port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})