var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.userList);

module.exports = router;

