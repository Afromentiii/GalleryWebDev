var express = require('express');
var router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');

// Middleware sprawdzający rolę admina
function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send('Brak dostępu - wymagana rola admin');
  }
}

router.get('/', authenticateJWT, authorizeAdmin, function(req, res, next) {
  res.render('admin-panel', { title: 'xd' });
});

module.exports = router;
