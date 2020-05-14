'use strict';

const express = require('express');
const path = require('path');
const app = express();
const db = require('./storage/database');
const user = require('./storage/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');

const publicURL = __dirname + "/public/";
const secretWord = "kek";

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
}

let storage = new Storage('localhost', 'tsaanstu', 'Abc123456#', '5432');

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(cookieParser());

//  КЛИЕНТСКАЯ ЧАСТЬ

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(publicURL + '/login/login.html');
});

app.get('/dashboard', (req, res) => {
    if (!req.cookies.user) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.json({error: "Необходима авторизация"});
    }
    let decoded = jwt.decode(req.cookies.user);

    if (req.cookies.user) {
        if (decoded.group === 'main') {
            res.sendFile(publicURL + '/dashboard/dashboardmain.html');
        } else if (decoded.group === 'admin') {
            res.sendFile(publicURL + '/dashboard/dashboardadmin.html');
        } else {
            res.sendFile(publicURL + '/dashboard/dashboarduser.html');
        }
    } else {
        res.redirect('/login');
    }
});

//  СЕРВЕРНАЯ ЧАСТЬ


app.post('/api/login', async function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(HttpStatus.BAD_REQUEST);
        res.json({error: "Введены некорректные данные"});
    }

    let email = req.body.email,
        password = req.body.password;
    let comp = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);

    let conn = storage.createConnect(comp);
    let result = user.user.authorization(conn, email, password);
    await result.then(function (value) {
        if (value.error != null) {
            res.status(HttpStatus.UNAUTHORIZED);
            res.json({error: "Введены некорректные данные"});
        } else {
            let token = jwt.sign({
                email: value.user.email,
                group: value.user.group,
                comp: comp
            }, secretWord);
            res.cookie('user', token, {httpOnly: true, secure: false, maxAge: 500 * 3600000});
            res.status(HttpStatus.OK);
            res.write("success");
        }
    });
});

app.get('/api/logout', (req, res) => {
    let decoded = jwt.decode(req.cookies.user);
    if (req.cookies.user) {
        res.clearCookie('user');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.route('/api/user')
    .get((req, res) => {
        //  тут будет получение данных пользователя
    })
    .post((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED);
            res.json({error: "Необходима авторизация"});
        }

        let decoded = jwt.decode(req.cookies.user);
        let userGroup = "";
        let company = decoded.comp;

        switch (decoded.group) {
            case "admin":
                userGroup = "user";
                break;
            default:
                userGroup = "admin";
                company = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);
                break;
        }

        let conn = storage.createConnect(company);

        user.user.createUser(conn, {
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: userGroup,
        });
        res.redirect('/dashboard');
    });

let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});