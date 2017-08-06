var passport = require('passport');

module.exports = function (app) {

    app.get('/auth', function (req, res) {

        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }

        res.render('auth', {
            error: req.flash('error')
        });
    });

    app.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/auth', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        failureFlash: true })
    );

    app.get('/auth/fb',
        passport.authenticate('facebook', {
            scope: 'read_stream'
        })
    );

    app.get('/auth/fb/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/auth' })
    );

}