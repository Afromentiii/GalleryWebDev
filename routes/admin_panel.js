const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

// Middleware sprawdzający rolę admina
function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send('Brak dostępu - wymagana rola admin');
  }
}

router.get('/', authenticateJWT, authorizeAdmin, async (req, res, next) => {
  try {
    // Pobierz wszystkich użytkowników
    const users = await User.find().lean();

    // Pobierz wszystkie galerie z dołączonym użytkownikiem (populate user)
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

module.exports = router;
