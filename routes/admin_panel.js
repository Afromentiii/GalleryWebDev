const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');
const multer = require('multer');
const path = require('path');

function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send('Brak dostępu - wymagana rola admin');
  }
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', authenticateJWT, authorizeAdmin, async (req, res, next) => {
  try {
    const users = await User.find().lean();

    const galleries = await Gallery.find().populate('user').lean();

    // Do każdej galerii dołącz obrazy
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
});

router.post('/users/add', authenticateJWT, authorizeAdmin, async (req, res) => {
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
});

router.post('/users/delete/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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
});

router.post('/galleries/add', authenticateJWT, authorizeAdmin, async (req, res) => {
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
});

router.post('/galleries/add-image/:id', authenticateJWT, authorizeAdmin, upload.single('image'), async (req, res) => {
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
});

router.post('/galleries/delete/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const galleryId = req.params.id;

    await Image.deleteMany({ gallery: galleryId });
    await Gallery.deleteOne({ _id: galleryId });

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

router.post('/images/delete/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const imageId = req.params.id;
    await Image.deleteOne({ _id: imageId });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
});

router.post('/images/edit/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
