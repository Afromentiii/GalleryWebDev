const Image = require('../models/image');
const Gallery = require('../models/gallery');

exports.addImage = async (req, res) => {
  try {
    const galleryId = req.params.id;
    const query = { _id: galleryId };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const gallery = await Gallery.findOne(query);
    if (!gallery) return res.status(404).send("Galeria nie znaleziona lub brak uprawnień");

    if (!req.file) return res.status(400).send("Brak przesłanego pliku");

    const newImage = new Image({
      name: req.file.originalname,
      path: '/images/' + req.file.filename,
      gallery: gallery._id,
      description: req.body.description || ''
    });
    await newImage.save();

    res.redirect(req.get('referer') || '/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId).populate('gallery');
    if (!image) return res.status(404).send("Obrazek nie znaleziony");

    if (image.gallery.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send("Brak dostępu do usunięcia tego obrazka");
    }

    await Image.deleteOne({ _id: imageId });
    res.redirect(req.get('referer') || '/dashboard');
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

    const image = await Image.findById(imageId).populate('gallery');
    if (!image) return res.status(404).send("Obrazek nie znaleziony");

    if (image.gallery.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send("Brak dostępu do edycji tego obrazka");
    }

    image.name = newName;
    image.description = newDescription !== undefined ? newDescription : image.description;
    await image.save();

    res.redirect(req.get('referer') || '/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.image_list = async (req, res, next) => {
  try {
    const all_images = await Image.find({}).populate("gallery").exec();
    res.render("image_list", { title: "List of all images:", image_list: all_images });
  } catch(err) {
    next(err);
  }
};
