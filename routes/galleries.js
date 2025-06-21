var express = require('express');
var router = express.Router();

const gallery_controller = require("../controllers/galleryController");

router.get("/", gallery_controller.gallery_list);

module.exports = router;
