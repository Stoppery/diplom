const Client = require('pg-native');
const bcrypt = require('bcrypt');

module.exports.user = {
    createUser: function (conn, user) {
        let passwordHash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        conn.querySync(`INSERT INTO users(name, surname, phone, email, password, status, "group")` +
            `VALUES ('${user.name}', '${user.surname}', '${user.phone}', '${user.email}', '${passwordHash}', '${user.status}', '${user.group}');`);
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