const Client = require('pg-native');
const bcrypt = require('bcrypt');

module.exports.user = {
    createUser: function (conn, user) {
        let passwordHash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        conn.querySync(`INSERT INTO users(name, surname, phone, email, password, status, "group")` +
            `VALUES ('${user.name}', '${user.surname}', '${user.phone}', '${user.email}', '${passwordHash}', '${user.status}', '${user.group}');`);
    },

    checkSubscribe: function (conn, company) {
        let rows = conn.querySync(`SELECT company FROM subscribe WHERE company = '${company}' AND (subscribe_time >= NOW() OR always is true)`);
        return rows.length > 0
    },

    getSubscribeType: function (conn, company) {
        let rows = conn.querySync(`SELECT always as type FROM subscribe WHERE company = '${company}' AND (subscribe_time >= NOW() OR always is true)`);
        return rows[0].type
    },

    renewSubscribeForMonth: function (conn, company) {
        try {
            conn.querySync(`INSERT INTO subscribe(company, subscribe_time) VALUES ('${company}', NOW() + interval '1 month')`);
        } catch (e) {
            conn.querySync(`UPDATE subscribe SET subscribe_time = NOW() + interval '1 month', always = false`);
        }
    },

    addAlwaysSubscribe: function (conn, company) {
        console.log(`INSERT INTO subscribe(company, subscribe_time, always) VALUES ('${company}', NOW(), true)`)
        console.log(`UPDATE subscribe SET subscribe_time = NOW() + interval '1 month', always = true`)
        try {
            conn.querySync(`INSERT INTO subscribe(company, subscribe_time, always) VALUES ('${company}', NOW(), true)`);
        } catch (e) {
            conn.querySync(`UPDATE subscribe SET subscribe_time = NOW(), always = true`);
        }
    },

    updateUserPassword: function (conn, email, password) {
        let passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        conn.querySync(`UPDATE users SET password = '${passwordHash}' WHERE email = '${email}';`);
    },

    getUsers: function (conn, group) {
        let rows = conn.querySync(`SELECT name, surname, phone, email, status, "group" FROM users WHERE "group" = '${group}'`);
        let result = {
            users: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.users.push({
                    name: rows[i].name,
                    surname: rows[i].surname,
                    phone: rows[i].phone,
                    email: rows[i].email,
                    status: rows[i].status,
                    group: rows[i].group,
                })
            }
            return result;
        }

        result.error = "cant get users";
        return result
    },

    authorization: async function (conn, username, password) {
        let rows = conn.querySync(`SELECT name, surname, phone, email, password, status, "group" FROM users WHERE email = '${username}'`);
        if (rows.length > 0) {
            if (bcrypt.compareSync(password, rows[0].password)) {
                return {
                    user: {
                        name: rows[0].name,
                        surname: rows[0].surname,
                        phone: rows[0].phone,
                        email: rows[0].email,
                        status: rows[0].status,
                        group: rows[0].group,
                    },
                    error: null
                };
            }
            return {
                user: null,
                error: "bad password"
            };

        }

        return {
            user: null,
            error: "user not found"
        };
    },

    deleteUser: function (conn, email) {
        conn.querySync(`DELETE FROM users WHERE email = '${email}'`);
    },

    getUser: function (conn, email) {
        let rows = conn.querySync(`SELECT name, surname, phone, email, status, "group" FROM users WHERE email = '${email}'`);
        if (rows.length > 0) {
            return {
                user: {
                    name: rows[0].name,
                    surname: rows[0].surname,
                    phone: rows[0].phone,
                    email: rows[0].email,
                    status: rows[0].status,
                    group: rows[0].group,
                },
                error: null
            };
        }

        return {
            user: null,
            error: "user not found"
        };
    }
};