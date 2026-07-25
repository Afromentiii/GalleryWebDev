const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'twoj_tajny_klucz';

exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Logowanie',
    errors: {},
    formData: {}
  });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  let errors = {};

  if (!username || !password) {
    errors.general = 'Login i hasło są wymagane.';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('login', { title: 'Logowanie', errors, formData: { username } });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      errors.general = 'Użytkownik nie istnieje.';
      return res.render('login', { title: 'Logowanie', errors, formData: { username } });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors.general = 'Hasło jest błędne.';
      return res.render('login', { title: 'Logowanie', errors, formData: { username } });
    }

    const payload = { username: user.username, role: user.role, id: user._id };
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
    res.render('login', { title: 'Logowanie', errors, formData: { username } });
  }
};

exports.getRegister = (req, res) => {
  const { success, error } = req.query;
  res.render('register', {
    title: 'Rejestracja',
    errors: error ? { general: error } : {},
    success,
    formData: {}
  });
};

exports.postRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  let errors = {};

  if (!username || !email || !password || !confirmPassword) {
    errors.general = 'Wszystkie pola są wymagane.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Hasła nie są zgodne.';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('register', { title: 'Rejestracja', errors, formData: { username, email } });
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
    const user = new User({ username, email, password: hashedPassword, role: 'user' });
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
};

exports.postLogout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
