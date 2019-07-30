const createError = require('http-errors');
const express = require('express');
const handleBars = require('express-handlebars');
const sassMiddleware = require('node-sass-middleware');
const browserify = require('browserify-middleware');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');

const app = express();

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
app.get('/javascripts/bundle.js', browserify('./client/script.js'));

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
