module.exports.version = {
    getVersions: function (conn, email, file) {
        let rows = conn.querySync(`SELECT v.id, proot, version, v.datecreation, v.datemodified, users.name FROM version as v JOIN project ON proot=project.id JOIN users ON authorv=users.id WHERE file='${file}'`);
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
                    datemodified: rows[i].datemodified,
                    author: rows[i].name,
                })
            }
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
            conn.querySync(`INSERT INTO version(version, datecreation, datemodified, authorv, proot) ` +
                `VALUES('version 1', '${newDate}', '${newDate}', '${idAuth}', '${idFile}');`);
        }
        return this.getVersions(conn, email, file);
    },
    createVersion: function (conn, email, version){
        let row = conn.querySync(`SELECT id FROM users WHERE email = '${email}'`);
        if(row.length > 0){
            let idUs = row[0].id;
            console.log(version.proot);
            conn.querySync(`INSERT into version(version, datecreation, datemodified, proot, authorv)` + 
            `VALUES('${version.version}','${version.datecreate}','${version.datecreate}',${version.proot}, ${idUs});`);
            let res = conn.querySync(`SELECT id FROM version WHERE version = '${version.version}'`);
            let idVer = res[0].id;
            console.log(idVer);
            return {
                message: "Версия успешно создана",
                id: idVer,
                error: null,
                }
        } else { 
            return {
                message: null,
                error: "Пользователь не найден"
            }
        }
    },
    deleteVersion: function(conn, idV){
        conn.querySync(`DELETE FROM version WHERE id = '${idV}'`);
    },
    showVersion: function(conn, idV){
        let row = conn.querySync(`SELECT id, version, datecreation, datemodified, data, proot, authorv FROM version WHERE id='${idV}'`);
        let result = {
            versions: [],
            error: null,
        };
        if (row.length > 0) {
            result.versions.push({
                id: row[0].id,
                root: row[0].proot,
                version: row[0].version,
                datecreate: row[0].datecreation,
                datemodified: row[0].datemodified,
                author: row[0].name,
            })
            return result;
        } else {
            result.error = "Can`t get version";
            return result;
        }

    }
};