var config = require("nconf");
var passport = require('passport');
var AuthLocalStrategy = require('passport-local').Strategy;
var AuthFacebookStrategy = require('passport-facebook').Strategy;

var dn = require("dynamicsnode");
var crm = new dn.CRMClient("AuthType=AD; Url=https://my.dynamics/crm; Domain=mydomain; Username=user; Password=password");

passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {

        var object = {
            tel:username,
            pass:password
        };
        var obj = userExistMobilePass(object);
        if (obj) {
            return done(null, {
                user: obj
            });
        }

        return done(null, false, {
            message: 'Неверный логин или пароль'
        });

        function userExistMobilePass(object) {

            var fetch = new dn.Fetch("contact", true, {tel: object.tel, StateCode: 0});
            var contact = crm.retrieveMultiple(fetch.toString());
            var result = false;
            contact.rows.forEach(function (ak) {
                if(ak.webpass === makeHash(object)){
                    result = ak;
                }
            });

            return result;
        }

        function makeHash(object) {
            // make some magic with object and return it ;)
            return mobject;
        }
    }
));

passport.use('facebook', new AuthFacebookStrategy({
        clientID: config.get("auth:fb:app_id"),
        clientSecret: config.get("auth:fb:secret"),
        callbackURL: config.get("app:url") + "/auth/fb/callback",
        profileFields: [
            'id',
            'displayName',
            'profileUrl',
            // "username",
            // "link",
            "gender",
            "photos"
        ]
    },
    function (accessToken, refreshToken, profile, done) {

        //console.log("facebook auth: ", profile);

        return done(null, {
            username: profile.displayName,
            photoUrl: profile.photos[0].value,
            profileUrl: profile.profileUrl
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(err)
    }
});

module.exports = function (app) {
};