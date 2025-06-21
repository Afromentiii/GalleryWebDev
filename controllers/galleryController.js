const gallery = require("../models/gallery");

const asyncHandler = require("express-async-handler");

exports.gallery_list = asyncHandler(async (req, res, next) => {
  const all_galleries = await gallery.find({}).populate("user").exec();
  res.render("gallery_list", { title: "List of all galleries:", gallery_list: all_galleries });
});

