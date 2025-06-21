const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

// W pliku multer config - załóżmy, że multer config jest w routes/someRoute.js
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // przejdź do folderu głównego projektu, a stamtąd do public/images
    cb(null, path.resolve(__dirname, '../public/images'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


router.get('/', authenticateJWT, async (req, res) => {
  try {
    // Twoje galerie
    const galleries = await Gallery.find({ user: req.user.id }).lean();

    for (const gallery of galleries) {
      gallery.images = await Image.find({ gallery: gallery._id }).lean();
    }

    // Galerie innych użytkowników
    const otherGalleries = await Gallery.find({ user: { $ne: req.user.id } }).lean();

    for (const gallery of otherGalleries) {
      gallery.images = await Image.find({ gallery: gallery._id }).lean();
    }

    res.render('dashboard', { user: req.user, galleries, otherGalleries });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
});


// Dodawanie galerii
router.post('/gallery/add', authenticateJWT, async (req, res) => {
  try {
    const { galleryName } = req.body;
    if (!galleryName) return res.status(400).send("Nazwa galerii jest wymagana.");

    const newGallery = new Gallery({
      name: galleryName,
      user: req.user.id
    });
    await newGallery.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Dodawanie obrazka do galerii
router.post('/gallery/:id/add-image', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const galleryId = req.params.id;
    const gallery = await Gallery.findOne({ _id: galleryId, user: req.user.id });
    if (!gallery) return res.status(404).send("Galeria nie znaleziona");

    if (!req.file) return res.status(400).send("Brak przesłanego pliku");

    const newImage = new Image({
      name: req.file.originalname,
      path: '/images/' + req.file.filename,
      gallery: gallery._id,
      description: req.body.description || '' // dodane pole opisu
    });
    await newImage.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Usuwanie galerii i obrazków
router.post('/gallery/delete/:id', authenticateJWT, async (req, res) => {
  try {
    const galleryId = req.params.id;
    await Gallery.deleteOne({ _id: galleryId, user: req.user.id });
    await Image.deleteMany({ gallery: galleryId });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Usuwanie pojedynczego obrazka
router.post('/image/delete/:id', authenticateJWT, async (req, res) => {
  try {
    const imageId = req.params.id;

    // Znajdź obrazek i sprawdź czy należy do użytkownika (poprzez galerię)
    const image = await Image.findById(imageId).populate('gallery');
    if (!image) return res.status(404).send("Obrazek nie znaleziony");

    if (image.gallery.user.toString() !== req.user.id) {
      return res.status(403).send("Brak dostępu do usunięcia tego obrazka");
    }

    await Image.deleteOne({ _id: imageId });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

// Edycja obrazka - zmiana nazwy
router.post('/image/edit/:id', authenticateJWT, async (req, res) => {
  try {
    const imageId = req.params.id;
    const { newName, newDescription } = req.body;

    if (!newName) return res.status(400).send("Nazwa obrazka jest wymagana");

    const image = await Image.findById(imageId).populate('gallery');
    if (!image) return res.status(404).send("Obrazek nie znaleziony");

    if (image.gallery.user.toString() !== req.user.id) {
      return res.status(403).send("Brak dostępu do edycji tego obrazka");
    }

    image.name = newName;
    image.description = newDescription !== undefined ? newDescription : image.description;

    await image.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});



// Wylogowanie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
