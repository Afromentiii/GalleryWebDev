function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send('Brak dostępu - wymagana rola admin');
  }
}

module.exports = authorizeAdmin;
