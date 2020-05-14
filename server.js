const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const db = require('./storage/database');
const user = require('./storage/user');
const app = express();
const fs = require("fs");

class Storage {
    constructor(PGHOST, PGUSER, PGPASSWORD, PGPORT) {
        this.PGHOST = PGHOST;
        this.PGUSER = PGUSER;
        this.PGPASSWORD = PGPASSWORD;
        this.PGPORT = PGPORT;
        this.state = {};
    }

    createConnect(database) {
        return db.database.dbConnect(this.PGHOST, this.PGUSER, database, this.PGPASSWORD, this.PGPORT);
    }

    createNewConnect(username, database) {
        let conn = this.createConnect(database);
        this.state[username] = conn;
        return conn;
    }

    getUserConnect(username) {
        return this.state[username]
    }

    disconnectUser(username) {
        delete this.state[username]
    }
}

let storage = new Storage('localhost', 'postgres', 'Xtcyjr007', '5432');

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
    .post(async (req, res) => {

        let email = req.body.email,
            password = req.body.password;
        let comp = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);

        let conn = storage.createNewConnect(email, comp);
        let result = user.user.authorization(conn, email, password);
        result.then(function (value) {
            if (value.error != null) {
                console.log("error = ", value.error);
                res.redirect('/login');
            } else {
                req.session.user = value.user;
                res.redirect('/dashboard');
            }
        })
    });


app.route('/createadmin')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/dashboardmain.html');
    })
    .post((req, res) => {
        let comp = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);
        let conn = storage.createConnect(comp);
        user.user.createUser(conn, {
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: "admin"
        });
        res.redirect('/dashboard');
    });
app.route('/createuser')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/dashboarduser.html');
    })
    .post((req, res) => {
        let conn = storage.getUserConnect(req.session.user.email);
        user.user.createUser(conn, {
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: "user"
        });
        res.redirect('/dashboard');
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
        storage.disconnectUser(req.session.user.email);
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

/*app.route('/profile')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/profile.html');
    })
    .post((req, res) => {
        let conn = storage.getUserConnect(req.session.user.email);
        let email = req.session.user.email;
        let profileData = user.user.profileUser(conn , email);
        console.log(profileData)
        res.redirect('/profile');
    });
*/
    


app.get('/profile', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       let conn = storage.getUserConnect(req.session.user.email);
       let email = req.session.user.email;
       let profileData = user.user.profileUser(conn , email);
       console.log(profileData[0]);
       res.sendFile(__dirname + '/public/Profile.html');
       //console.log(profileData[0].name);
    }
    else {
        let conn = storage.getUserConnect(req.session.user.email);
        let email = req.session.user.email;
        let profileData = user.user.profileUser(conn , email);
        //console.log(profileData[0]); // res.sendFile(__dirname + '/public/profile.html');
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));