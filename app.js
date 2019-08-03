const createError = require('http-errors');
const express = require('express');
const handleBars = require('express-handlebars');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const browserify = require('browserify-middleware');
const bodyParser = require('body-parser');
const todos = require('./routes/todos/index');
const todosAPI = require('./routes/todos/api');
const dotenv = require('dotenv');
require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/todos', todos);
app.use('/api/todos', todosAPI);

// view engine setup
app.engine('hbs', handleBars({ extname: '.hbs', defaultLayout: 'layout' }));
app.set('view engine', 'hbs');

app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: true
  })
);

browserify.settings({
  transform: ['hbsfy']
});

app.get('/javascripts/bundle.js', browserify('./client/script.js'));

const dbConnectionString = process.env.MONGODB_URI || 'mongodb://localhost';
mongoose.connect(dbConnectionString + '/todos');

if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: [
      'public/**/*.{js,css}',
      'client/*.js',
      'sass/**/*.scss',
      'views/**/*.hbs'
    ],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/fonts',
  express.static(
    path.join(__dirname, 'node_modules/bootstrap-sass/assets/fonts')
  )
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
