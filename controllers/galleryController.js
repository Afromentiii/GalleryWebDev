const Gallery = require('../models/gallery');
const Image = require('../models/image');

exports.addGallery = async (req, res) => {
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
};

exports.deleteGallery = async (req, res) => {
  try {
    const galleryId = req.params.id;
    const query = { _id: galleryId };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const result = await Gallery.deleteOne(query);
    if (result.deletedCount === 0) return res.status(403).send("Brak dostępu");
    await Image.deleteMany({ gallery: galleryId });
    res.redirect(req.get('referer') || '/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

exports.gallery_list = async (req, res, next) => {
  try {
    const all_galleries = await Gallery.find({}).populate("user").exec();
    res.render("gallery_list", { title: "List of all galleries:", gallery_list: all_galleries });
  } catch(err) {
    next(err);
  }
};
