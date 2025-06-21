var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var galleriesRouter = require('./routes/galleries');
var imagesRouter = require('./routes/images');
var statsRouter = require('./routes/stats');
var loginRouter =  require('./routes/login');
var registerRouter = require('./routes/register');
var dashboardRouter = require('./routes/dashboard');
var adminRouter = require('./routes/admin_panel');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/galleries', galleriesRouter);
app.use('/images', imagesRouter);
app.use('/stats', statsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter)
app.use('/dashboard', dashboardRouter)
app.use('/admin', adminRouter)

app.use(express.static('public'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const mongoDB = "mongodb://localhost:27017/GalleryDB";
const bcrypt = require('bcrypt');

async function createAdminIfNotExists() {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin', 10); // 10 to salt rounds
      const newAdmin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Konto admina zostało utworzone.');
    } else {
      console.log('Admin już istnieje.');
    }
  } catch (err) {
    console.error('Błąd podczas tworzenia admina:', err);
  }
}

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("✅ Połączono z MongoDB: GalleryDB");

    // Tworzymy admina, jeśli go nie ma
    await createAdminIfNotExists();

  } catch (err) {
    console.error("❌ Błąd połączenia z MongoDB:", err);
  }
}

main();

module.exports = app;