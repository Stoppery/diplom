module.exports.version = {
    getVersions: function (conn, email, file) {
        console.log(file);
        let rows = conn.querySync(`SELECT v.id, proot, version, v.datecreation, users.name FROM version as v JOIN project ON proot=project.id JOIN users ON authorv=users.id WHERE email = '${email}' AND file='${file}'`);
        let result = {
            versions: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.versions.push({
                    id: rows[i].id,
                    root: rows[i].proot,
                    version: rows[i].version,
                    datecreate: rows[i].datecreation,
                    author: rows[i].name,
                })
            }
            console.log(result);
            return result;
        } else {
            result.error = "Can`t get versions";
            return result;
        }
    },
    startVersion: function (conn, email, file) {
        let row = conn.querySync(`SELECT id FROM project WHERE file='${file}'`);
        let rows = conn.querySync(`SELECT id FROM users WHERE email='${email}'`);
        if (row.length > 0 && rows.length > 0) {
            let idFile = row[0].id;
            let idAuth = rows[0].id;
            let newDate = new Date().toUTCString();
            conn.querySync(`INSERT INTO version(version, datecreation, authorv, proot) ` +
                `VALUES(1, '${newDate}', '${idAuth}', '${idFile}');`);
        }
        return this.getVersions(conn, email, file);
    }
};