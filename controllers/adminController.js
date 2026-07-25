const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

exports.index = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    const galleries = await Gallery.find().populate('user').lean();

    for (const gallery of galleries) {
      gallery.images = await Image.find({ gallery: gallery._id }).lean();
    }

    res.render('admin-panel', {
      title: 'Panel administratora',
      users,
      galleries
    });
  } catch (err) {
    next(err);
  }
};

exports.addGallery = async (req, res) => {
  try {
    const { galleryName, userId } = req.body;
    if (!galleryName || !userId) return res.status(400).send("Nazwa galerii i użytkownik są wymagane");

    const newGallery = new Gallery({
      name: galleryName,
      user: userId
    });

    await newGallery.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.addImage = async (req, res) => {
  try {
    const galleryId = req.params.id;
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) return res.status(404).send("Galeria nie znaleziona");

    if (!req.file) return res.status(400).send("Brak przesłanego pliku");

    const newImage = new Image({
      name: req.file.originalname,
      path: '/images/' + req.file.filename,
      gallery: gallery._id,
      description: req.body.description || ''
    });
    await newImage.save();

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const galleryId = req.params.id;
    await Image.deleteMany({ gallery: galleryId });
    await Gallery.deleteOne({ _id: galleryId });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    await Image.deleteOne({ _id: imageId });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.editImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const { newName, newDescription } = req.body;

    if (!newName) return res.status(400).send("Nazwa obrazka jest wymagana");

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).send("Obrazek nie znaleziony");

    image.name = newName;
    image.description = newDescription !== undefined ? newDescription : image.description;
    await image.save();

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};
