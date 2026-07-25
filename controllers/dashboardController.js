const Gallery = require('../models/gallery');
const Image = require('../models/image');

exports.index = async (req, res) => {
  try {
    const galleries = await Gallery.find({ user: req.user.id }).lean();
    for (const gallery of galleries) {
      gallery.images = await Image.find({ gallery: gallery._id }).lean();
    }

    res.render('dashboard', { user: req.user, galleries });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

exports.otherGalleries = async (req, res) => {
  try {
    const otherGalleries = await Gallery.find({ user: { $ne: req.user.id } }).populate('user').lean();
    for (const gallery of otherGalleries) {
      gallery.images = await Image.find({ gallery: gallery._id }).lean();
    }

    res.render('other-galleries', { user: req.user, otherGalleries });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};

exports.viewGallery = async (req, res) => {
  try {
    const galleryId = req.params.id;
    const gallery = await Gallery.findById(galleryId).populate('user').lean();
    
    if (!gallery) {
      return res.status(404).send('Galeria nie znaleziona');
    }

    gallery.images = await Image.find({ gallery: gallery._id }).lean();
    
    const isOwner = req.user && req.user.id === gallery.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    res.render('gallery-details', { user: req.user, gallery, isOwner, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
};
