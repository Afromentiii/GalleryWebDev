const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res) => {
  const { success, error } = req.query;
  res.render('register', {
    title: 'Rejestracja',
    errors: error ? { general: error } : {},
    success,
    formData: {}
  });
});

router.post('/', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  let errors = {};

  if (!username || !email || !password || !confirmPassword) {
    errors.general = 'Wszystkie pola są wymagane.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Hasła nie są zgodne.';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('register', {
      title: 'Rejestracja',
      errors,
      formData: { username, email }
    });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.render('register', {
        title: 'Rejestracja',
        errors: { username: 'Użytkownik o tej nazwie już istnieje.' },
        formData: { username, email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    res.redirect('/login');

  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

module.exports = router;
