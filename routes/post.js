const express = require("express");
// const router = express.Router()
const router = require("express-promise-router")();

const postControllers = require("../controllers/post");

router.route("/:userID").post(postControllers.newPost);

module.exports = router;
