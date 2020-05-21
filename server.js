'use strict';

const express = require('express');
const path = require('path');
const app = express();
const db = require('./storage/database');
const user = require('./storage/user');
const admin = require('./storage/admin');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');

const publicURL = __dirname + "/public/";
const secretWord = "kek";
const pgHost = "localhost";
const pgUser = "tsaanstu";
const pgPassword = "Abc123456#";
const pgPort = "5432#";

class Storage {
    constructor(PGHOST, PGUSER, PGPASSWORD, PGPORT) {
        this.PGHOST = PGHOST;
        this.PGUSER = PGUSER;
        this.PGPASSWORD = PGPASSWORD;
        this.PGPORT = PGPORT;
    }

    createConnect(database) {
        return db.database.dbConnect(this.PGHOST, this.PGUSER, database, this.PGPASSWORD, this.PGPORT);
    }
}

let storage = new Storage(pgHost, pgUser, pgPassword, pgPort);

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(cookieParser());
app.set('etag', false);

//  КЛИЕНТСКАЯ ЧАСТЬ

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (!req.cookies.user) {
        res.sendFile(publicURL + '/login/login.html');
        return
    }
    res.redirect('/dashboard');
});

app.get('/profile', (req, res) => {
    res.sendFile(publicURL + '/profile/profile.html');
});

app.get('/adminpanel', (req, res) => {
    res.sendFile(publicURL + '/adminpanel/adminpanel.html');
});

app.get('/dashboard', (req, res) => {
    if (!req.cookies.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
        return
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

app.get('/api/admin/check', (req, res) => {
    if (!req.cookies.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
        return
    }

    let decoded = jwt.decode(req.cookies.user);

    if (decoded.group === "admin") {
        res.sendStatus(HttpStatus.OK);
        return
    }
    res.sendStatus(HttpStatus.UNAUTHORIZED);
});

app.post('/api/login', async function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(HttpStatus.BAD_REQUEST).json({error: "Введены некорректные данные"});
        return
    }

    let email = req.body.email,
        password = req.body.password;
    let comp = req.body.email.substr(req.body.email.indexOf("@") + 1, req.body.email.lastIndexOf(".") - req.body.email.indexOf("@") - 1);

    let conn = storage.createConnect(comp);
    let result = user.user.authorization(conn, email, password);
    await result.then(function (value) {
        if (value.error != null) {
            res.status(HttpStatus.BAD_REQUEST).json({error: "Неверные данные"});
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

app.route('/api/showUsers')
    .get(function (req, res) {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }

        let decoded = jwt.decode(req.cookies.user);
        let conn = storage.createConnect(decoded.comp);

        let usersData = user.user.getUsers(conn, "user");

        if (usersData.error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: usersData.error});
        } else {
            res.status(HttpStatus.OK).json({users: usersData.users});
        }
    });

app.route('/api/user/password')
    .post((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }

        if (!req.body.password) {
            res.status(HttpStatus.BAD_REQUEST).json({error: "Некорректные данные"});
            return
        }

        let decoded = jwt.decode(req.cookies.user);
        let conn = storage.createConnect(decoded.comp);

        user.user.updateUserPassword(conn, decoded.email, req.body.password);
        res.sendStatus(HttpStatus.OK)
    });

app.route('/api/user')
    .get((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }

        if (!req.body.email) {
            res.status(HttpStatus.BAD_REQUEST).json({error: "Некорректные данные"});
            return
        }

        let decoded = jwt.decode(req.cookies.user);
        let conn = storage.createConnect(decoded.comp);

        let userData = user.user.getUser(conn, req.body.email);
        if (userData.error) {
            res.sendStatus(HttpStatus.NOT_FOUND);
            res.json({error: userData.error});
        } else {
            res.json(userData.user);
        }
    })
    .delete((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }

        let decoded = jwt.decode(req.cookies.user);
        if (decoded.group !== "admin") {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }

        let email = req.query.email;
        if (email === "") {
            res.status(HttpStatus.BAD_REQUEST).json({error: "Неверные параметры"});
            return
        }

        let conn = storage.createConnect(decoded.comp);

        user.user.deleteUser(conn, email);
        res.sendStatus(HttpStatus.OK);
    })
    .post((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
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

        let conn;
        try {
            conn = storage.createConnect(company);
        } catch (e) {
            if (userGroup === "admin") {
                admin.admin.createDB(pgHost, pgUser, pgPassword, pgPort, company).then(() => {
                    conn = storage.createConnect(company);
                    user.user.createUser(conn, {
                        name: req.body.name,
                        surname: req.body.surname,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: req.body.password,
                        status: req.body.status,
                        group: userGroup,
                    });
                    res.sendStatus(HttpStatus.CREATED);
                });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({error: "База данных не найдена"});
            }
            return;
        }

        user.user.createUser(conn, {
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            group: userGroup,
        });
        res.sendStatus(HttpStatus.CREATED);
    });

app.route('/api/profile')
    .get((req, res) => {
        if (!req.cookies.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({error: "Необходима авторизация"});
            return
        }
        let decoded = jwt.decode(req.cookies.user);
        let conn = storage.createConnect(decoded.comp);

        let userData = user.user.getUser(conn, decoded.email);
        if (userData.error) {
            res.status(HttpStatus.NOT_FOUND).json({error: userData.error});
        } else {
            res.status(HttpStatus.OK).json(userData.user);
        }
    });

let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});