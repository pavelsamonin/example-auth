var config = require("nconf");
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var flash = require('connect-flash');

module.exports = function (app) {

    app.set('port', config.get("app:port") || 3000);
    app.set('views', path.join(__dirname + "/..", 'views'));
    app.set('view engine', 'ejs');

    var sessionOptions = config.get("session");
    if ('production' == app.get('env')) {
        var MemcachedStore = require('connect-memcached')(session);
        sessionOptions.store = new MemcachedStore(config.get("memcached"));
    }

    //if behind a reverse proxy such as Varnish or Nginx
    app.enable('trust proxy');
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname + "/..", 'public')));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
};
