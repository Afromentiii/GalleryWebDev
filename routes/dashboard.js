const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');

router.get('/', authenticateJWT, (req, res) => {
  res.render('dashboard', { user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});
module.exports = router;
