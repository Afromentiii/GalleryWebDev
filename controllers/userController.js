const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

exports.addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).send("Wypełnij wszystkie pola");

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("Użytkownik już istnieje");

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const galleries = await Gallery.find({ user: userId });
    for (const gallery of galleries) {
      await Image.deleteMany({ gallery: gallery._id });
    }
    await Gallery.deleteMany({ user: userId });
    await User.deleteOne({ _id: userId });

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.userList = async (req, res, next) => {
  try {
    const allUsers = await User.find({}).exec();
    res.render("user_list", { title: "GalleryDB users:", user_list: allUsers });
  } catch(err) {
    next(err);
  }
};
