var db = require('./db');

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
/*hash('foobar', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;
  users.tj.hash = hash;
});*/

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
var authenticate = function authenticate(email, pass, fn) {
    console.log(email);
    console.log(pass);
    console.log('authenticating %s:%s', email, pass);

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, pass],
        function (err, rows, result) {
            if (err || rows.length == 0) {
                return fn(new Error('cannot find user'));
            }
            user = rows[0];
            console.log(user);
            
            // apply the same algorithm to the POSTed password, applying the hash against the pass / salt
            // if there is a match we found the user
            /*hash(pass, user.salt, function(err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });*/
            //res.render('stores', { title: 'Zoombud Stores', allstores: allstores });
        }
    );
}
module.exports = { authenticate: authenticate, restrict: restrict };