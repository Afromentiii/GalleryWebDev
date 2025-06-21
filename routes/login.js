const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'twoj_tajny_klucz'; // powinno być w .env

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Logowanie',
    errors: {},
    formData: {}
  });
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  let errors = {};

  if (!username || !password) {
    errors.general = 'Login i hasło są wymagane.';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('login', {
      title: 'Logowanie',
      errors,
      formData: { username }
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      errors.general = 'Użytkownik nie istnieje.';
      return res.render('login', {
        title: 'Logowanie',
        errors,
        formData: { username }
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors.general = 'Hasło jest błędne.';
      return res.render('login', {
        title: 'Logowanie',
        errors,
        formData: { username }
      });
    }

    const payload = { username: user.username, role: user.role, id: user._id  };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'Strict',
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    errors.general = 'Błąd serwera';
    res.render('login', {
      title: 'Logowanie',
      errors,
      formData: { username }
    });
  }
});

module.exports = router;
