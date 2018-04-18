const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const clients = require('./routes/clients');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*
    Stores client details to memory storage
 */
const storeClient = (req, res, next)=>{
    let client = {
        ip: req.ip,
        url: req.originalUrl,
        dateTime: Date.now()
    };
    let prevClients = app.get('prevClients') || [];
    let clients = app.get('clients') || [];
    if (req.originalUrl === '/prev'){
        prevClients.push(client);
    }
    else {
        clients.push(client);
    }
    app.set('prevClients', prevClients);
    app.set('clients',clients);
    next();
};

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('*', storeClient);

app.use('/', clients);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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