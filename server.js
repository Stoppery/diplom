let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let morgan = require('morgan');
let Sequelize = require('sequelize');

let alert = require('alert-node');
let app = express();

app.set('port', 8080);

app.use(morgan('dev'));

app.use(express.static('./public/'));

app.use(bodyParser.urlencoded({extended: true}));

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

let sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        
        let email = req.body.email,
            password = req.body.password;
         global.comp = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);
         let User = require('./models/user');
        console.log("data = ", global.comp);

        User.findOne({where: {email: email}}).then(function (user) {
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


app.route('/createadmin')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/dashboardmain.html');
    })
    .post((req, res) => {
        let User = require('./models/user');
        User.create({
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: "admin"
        })
            .then(user => {
             // req.session.user = user.dataValues;
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.redirect('/dashboard');
            });
    });    
    app.route('/createuser')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/dashboarduser.html');
    })
    .post((req, res) => {
        let User = require('./models/user');
        User.create({
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: "user"
        })
            .then(user => {
             // req.session.user = user.dataValues;
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.redirect('/dashboard');
            });
    });    

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        let proverka = req.session.user.group;
        if (proverka == 'main') {
            res.sendFile(__dirname + '/public/dashboardmain.html');
        } else if (proverka == 'admin') {
            res.sendFile(__dirname + '/public/dashboardadmin.html');
        } else {
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
    } else 
    {    
        res.redirect('/login');
    }  
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));