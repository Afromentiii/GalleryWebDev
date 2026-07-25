const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const upload = require('../middlewares/upload');

const dashboardController = require('../controllers/dashboardController');
const galleryController = require('../controllers/galleryController');
const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');

router.get('/', authenticateJWT, dashboardController.index);
router.get('/other-galleries', authenticateJWT, dashboardController.otherGalleries);
router.get('/gallery/:id', authenticateJWT, dashboardController.viewGallery);

router.post('/gallery/add', authenticateJWT, galleryController.addGallery);
router.post('/gallery/delete/:id', authenticateJWT, galleryController.deleteGallery);

router.post('/gallery/:id/add-image', authenticateJWT, upload.single('image'), imageController.addImage);
router.post('/image/delete/:id', authenticateJWT, imageController.deleteImage);
router.post('/image/edit/:id', authenticateJWT, imageController.editImage);

router.post('/logout', authController.postLogout);

module.exports = router;
