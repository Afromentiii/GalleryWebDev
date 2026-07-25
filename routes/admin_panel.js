const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const upload = require('../middlewares/upload');

const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

// All routes here require both authentication and admin authorization
router.use(authenticateJWT);
router.use(authorizeAdmin);

// Dashboard
router.get('/', adminController.index);

// User Management
router.post('/users/add', userController.addUser);
router.post('/users/delete/:id', userController.deleteUser);

// Gallery Management
router.post('/galleries/add', adminController.addGallery);
router.post('/galleries/add-image/:id', upload.single('image'), adminController.addImage);
router.post('/galleries/delete/:id', adminController.deleteGallery);

// Image Management
router.post('/images/delete/:id', adminController.deleteImage);
router.post('/images/edit/:id', adminController.editImage);

module.exports = router;
