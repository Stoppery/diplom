module.exports.version = {
    getVersions: function (conn, email, file) {
        let rows = conn.querySync(`SELECT v.id, proot, data, version, v.datecreation, v.datemodified, users.name FROM version as v JOIN users ON authorv=users.id WHERE proot='${file}'`);
        let result = {
            versions: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.versions.push({
                    id: rows[i].id,
                    version: rows[i].version,
                    datecreate: rows[i].datecreation,
                    datemodified: rows[i].datemodified,
                    data: rows[i].data,
                    root: rows[i].proot,
                    author: rows[i].name,
                })
            }
            return result;
        } else {
            result.error = "Не удалось получить информацию о версиях проекта";
            return result;
        }
    },

    startVersion: function (conn, email, file) {
        let rows = this.getUserId(conn, email);
        if (rows.length > 0) {
            let idAuth = rows[0].id;
            let newDate = new Date().toUTCString();
            conn.querySync(`INSERT INTO version(version, datecreation, datemodified, authorv, proot) ` +
                `VALUES('version 1', '${newDate}', '${newDate}', '${idAuth}', '${file}');`);
            conn.querySync(`UPDATE project SET datelastmodified = '${newDate}' WHERE id = ${file}`);
        }
        return this.getVersions(conn, email, file);
    },

    createVersion: function (conn, email, version){
        let rowid = this.getUserId(conn, email);
  
        let rowroot = conn.querySync(`SELECT proot, data FROM version WHERE id = '${version.rootver}'`);
        if(rowid.length > 0 && rowroot.length > 0){
            let idUs = rowid[0].id;
            conn.querySync(`INSERT into version(version, datecreation, datemodified, data, proot, authorv)` + 
            `VALUES('${version.version}','${version.datecreate}','${version.datecreate}','${rowroot[0].data}', ${rowroot[0].proot}, ${idUs});`);
            conn.querySync(`UPDATE project SET datelastmodified = '${version.datecreate}' WHERE id = ${rowroot[0].proot}`);
            let res = conn.querySync(`SELECT id FROM version WHERE version = '${version.version}'`);
            return {
                message: "Версия успешно создана",
                id: res[0].id,
                error: null,
                }
        } else { 
            return {
                message: null,
                error: "Что-то пошло не так"
            }
        }
    },

    getUserId: function(conn, email){
        let rows = conn.querySync(`SELECT id FROM users WHERE email='${email}'`);
        return rows;
    },    

    deleteVersion: function(conn, idV){
        let row = conn.querySync(`SELECT proot FROM version WHERE id = '${idV}'`);
        conn.querySync(`DELETE FROM version WHERE id = '${idV}'`);
        let newDate = new Date().toUTCString();
        conn.querySync(`UPDATE project SET datelastmodified = '${newDate}' WHERE id = ${row[0].proot}`);
    },

    showVersion: function(conn, idV){
        let row = conn.querySync(`SELECT id, version, datecreation, datemodified, data, proot, authorv FROM version WHERE id='${idV}'`);
        let result = {
            versions: [],
            tags: [],
            error: null,
        };
        if (row.length > 0) {
            result.versions.push({
                id: row[0].id,
                version: row[0].version,
                datecreate: row[0].datecreation,
                datemodified: row[0].datemodified,
                data: row[0].data,
                root: row[0].proot,
                author: row[0].authorv,
            })

            let res = conn.querySync(`SELECT project_tag.tag, project_tag.project, description FROM tag JOIN project_tag ON tag.id=project_tag.tag WHERE project = ${row[0].proot}`);
            for(let i=0; i < res.length; i++){
                result.tags.push({
                    description: res[i].description,
                    tagId: res[i].tag,
                    projectId: res[i].project
                })
            }
            return result;
        } else {
            result.error = "Не удалось получить информацию о версиях";
            return result;
        }
    },

    saveVersion: function(conn, version){
        conn.querySync(`UPDATE version SET datemodified = '${version.datemodified}' WHERE id = ${version.id}`);
        let row = conn.querySync(`SELECT proot FROM version WHERE id = ${version.id}`);
        conn.querySync(`UPDATE project SET datelastmodified ='${version.datemodified}' WHERE id = ${row[0].proot}`);
        
    }
};