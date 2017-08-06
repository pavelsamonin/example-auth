module.exports = function (app) {

    app.get('/', function (req, res) {

        if (!req.isAuthenticated()) {
            res.redirect('/auth');
            return;
        }
        res.render('index', {
            user: req.user.user
        });
    });
};