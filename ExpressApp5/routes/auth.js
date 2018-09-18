//routes/auth.js
var passport = require('passport');

module.exports = function (app) {

    app.get('/auth', function (req, res) {

        if (req.isAuthenticated()) {
            console.log(req.user);
            res.redirect('/');
            return;
        }

        res.render('auth');
    });

    app.get('/sign-out', function (req, res) {
        req.logout();
        req.user = {};
        res.redirect('/');
    });

    app.post('/auth', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        failureFlash: true
    })
    );
    app.get('/auth/userdata', function (req, res) {
        User.findById(req.user, function (err, fulluser) {
            if (err) throw err;
            res.json(fulluser);
        })
    }); 
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.json(false);
        }
    };

}