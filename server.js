var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var alert= require('alert-node');
var app = express();

app.set('port', 9000);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        User.create({
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: req.body.group
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var email = req.body.email,
            password = req.body.password;

        User.findOne({ where: { email: email } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
    });

    app.get('/dashboard', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            var proverka = req.session.user.group;
            if (proverka == 'main'){
            res.sendFile(__dirname + '/public/dashboardmain.html');
            }
            else if (proverka == 'admin'){
                res.sendFile(__dirname + '/public/dashboardadmin.html');
                }
            else {
                res.sendFile(__dirname + '/public/dashboarduser.html');
            }
        } else {
            res.redirect('/login');
        }
    });

    app.get('/logout', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
      });

      app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));