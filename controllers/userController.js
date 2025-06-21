const user = require("../models/user");

const mongoose = require("mongoose");

// asynchronicznie
const asyncHandler = require("express-async-handler");

exports.userList = asyncHandler(async (req, res, next) => {
  const allUsers = await user.find({}).exec();
  res.render("user_list", { title: "GalleryDB users:", user_list: allUsers });
});

// można prościej np. z metodą then i funkcją callback w środku
// exports.userList=((req, res, next) => {
//   user.find({}).then((allUsers) => res.render("user_list", { title: "GalleryDB users:", user_list: allUsers }));
// });
