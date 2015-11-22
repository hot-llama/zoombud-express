var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var SessionStore = require('express-mysql-session');
var options = {
    host: 'localhost',
    port: 3306,
    user: 'zoombud',
    password: 'z00mbudz4peace!',
    database: 'zoombud',
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    autoReconnect: true,// Whether or not to re-establish a database connection after a disconnect.
    reconnectDelay: [
        500,// Time between each attempt in the first group of reconnection attempts; milliseconds.
        1000,// Time between each attempt in the second group of reconnection attempts; milliseconds.
        5000,// Time between each attempt in the third group of reconnection attempts; milliseconds.
        30000,// Time between each attempt in the fourth group of reconnection attempts; milliseconds.
        300000// Time between each attempt in the fifth group of reconnection attempts; milliseconds.
    ],
    reconnectDelayGroupSize: 5,// Number of reconnection attempts per reconnect delay value.
    maxReconnectAttempts: 25,// Maximum number of reconnection attempts. Set to 0 for unlimited.
    useConnectionPooling: false,// Whether or not to use connection pooling.
    keepAlive: true,// Whether or not to send keep-alive pings on the database connection.
    keepAliveInterval: 30000,// How frequently keep-alive pings will be sent; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
var sessionStore = new SessionStore(options);
var session_funcs = require('./session');

var routes = require('./routes/index');
var admin_routes = require('./routes/admin');
var api_routes = require('./routes/api');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// adding mysql store for storing session vars
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "z00mbudistheplaceformelivingalifeofecstacyz00mbudistheplaceforme",
    store: sessionStore
}));

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/admin', admin_routes);
app.use('/api', api_routes);
app.use('/users', users);

// session-persisted message middleware
app.use(function(req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

app.get('/login', function(req, res) {
    res.render('login', {title: 'Zoombud Login', errormsg: res.locals.message});
});

app.post('/login', function(req, res) {
    session_funcs.authenticate(req.body.username, req.body.password, function(err, user) {
        if (user) {
            // regenerate session when signing in to prevent fixation
            req.session.regenerate(function() {
                // Store the user's primary key in the session store to be retrieved, or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.email
                  + ' click to <a href="/logout">logout</a>. '
                  + ' You may now access <a href="/admin">/admin</a>.';
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your username and password.';
            res.redirect('/login');
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
