const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { searchJobsController } = require("../controllers/job.controller");

const router = express.Router();

router.get("/search", authUser, searchJobsController);

module.exports = router;