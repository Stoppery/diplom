const Client = require('pg-native');
const bcrypt = require('bcrypt');

module.exports.project = {
    getProject: function(conn, email){
        let rows = conn.querySync(`SELECT project.file, datecreation, author FROM project JOIN users ON author=users.id WHERE email = '${email}'`);
        if (rows.length > 0) {
            console.log(rows.length);
            return {
                project: {
                    file: rows[0].file,
                    datecreate: rows[0].datecreation,
                    datemodified: rows[0].datelastmodified,
                    author: rows[0].author,
                    depth: rows[i].depth,
                },
                error: null
            };
        }

        return {
            project: null,
            error: "You haven`t any project"
        };
    },
    getProjects: function (conn, email) {
        let rows = conn.querySync(`SELECT file, datecreation, datelastmodified, users.name, depth FROM project JOIN users ON author=users.id WHERE email = '${email}'`);
        let result = {
            projects: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.projects.push({
                    file: rows[i].file,
                    datecreate: rows[i].datecreation,
                    datemodified: rows[i].datelastmodified,
                    author: rows[i].name,
                    depth: rows[i].depth,
                })
            }
            return result;
        }

        result.error = "Can`t get projects";
        return result
    },

    getAllProjects: function (conn, email) {
        let rows = conn.querySync(`SELECT file, datecreation, datelastmodified, users.name, depth FROM project JOIN users ON author=users.id WHERE email != '${email}' ORDER BY datecreation`);
        let result = {
            projects: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.projects.push({
                    file: rows[i].file,
                    datecreate: rows[i].datecreation,
                    datemodified: rows[i].datelastmodified,
                    author: rows[i].name,
                    depth: rows[i].depth,
                })
            }
            return result;
        }

        result.error = "Can`t get projects";
        return result
    },

    createProject: function(conn, email, project){
        let row = conn.querySync(`SELECT id FROM users WHERE email = '${email}'`);
        if(row.length > 0){
            let idUs = row[0].id;
            conn.querySync(`INSERT into project(file, datecreation, datelastmodified, depth, author)` + 
        `VALUES('${project.file}','${project.datecreate}','${project.datemodified}',${project.depth}, ${idUs});`);
        } else { 
            console.log("Can`t found user");
        }
        
    },

    deleteProject: function (conn, file) {
        conn.querySync(`DELETE FROM project WHERE file = '${file}'`);
    },
   
};
