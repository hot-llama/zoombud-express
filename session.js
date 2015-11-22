var db = require('./db');
var bcrypt = require('bcrypt-nodejs');
// generate a salt
//var salt = bcrypt.genSaltSync(10);

var hash = function hash(password, callback) {
    callback(null, password);
    // TODO: get hash functionanlity working
    /*bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, null, function(err, hash) {
            if (err) return callback(err, null);
            callback(null, hash);
        });
    });*/
}

// function that checks if user session is active. redirects to login page if not
var restrict = function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

// function that authenticates a user login
var authenticate = function authenticate(email, pass, next) {
    console.log('authenticating %s:%s', email, pass);

    db.query('SELECT * FROM users WHERE email = ?', email,
        function (err, rows, result) {
            if (err || rows.length == 0) {
                return next(new Error('cannot find user'));
            }
            user = rows[0];
            //console.log(user.password);
            //console.log(pass);
            
            if (pass != user.password)
                return next(new Error('cannot find user'));
            
            next(null, user);
            
            // TODO: get hash compare working
            /*bcrypt.compare(pass, user.password, function(err, result) {
                console.log(result);
                if (err)
                    console.log(err);
                if (result) {
                    
                } else
                    return next(new Error('cannot find user'));
            });*/
        }
    );
}
module.exports = { hash: hash, authenticate: authenticate, restrict: restrict };