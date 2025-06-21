var express = require('express');
var router = express.Router();

// import modułu kontrolera
const userController = require("../controllers/userController");

router.get("/", userController.userList);

module.exports = router;

// https://mongoosejs.com/docs/models.html