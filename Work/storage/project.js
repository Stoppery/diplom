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

    getProjectsCount: function (conn) {
        let rows = conn.querySync(`SELECT count(id) as count FROM project`);
        return rows[0].count
    },

    getProjects: function (conn, email) {
        let rows = conn.querySync(`SELECT p.id, file, datecreation, datelastmodified, users.name, depth FROM project as p JOIN users ON author=users.id WHERE email = '${email}' ORDER BY datelastmodified DESC`);
        let result = {
            projects: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.projects.push({
                    id: rows[i].id,
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
        let rows = conn.querySync(`SELECT DISTINCT p.id, file, p.datecreation, datelastmodified, users.name, depth FROM project as p JOIN users ON author=users.id INNER JOIN version ON proot=p.id WHERE email != '${email}' ORDER BY datecreation DESC`);
        let result = {
            projects: [],
            error: null,
        };

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.projects.push({
                    id: rows[i].id,
                    file: rows[i].file,
                    datecreate: rows[i].datecreation,
                    datemodified: rows[i].datelastmodified,
                    author: rows[i].name,
                    depth: rows[i].depth,
                })
            }
            return result;
        }

        result.error = "В вашей компании еще нет проектов";
        return result
    },

    createProject: function(conn, email, project){
        let row = conn.querySync(`SELECT id FROM users WHERE email = '${email}'`);
        if(row.length > 0){
            let idUs = row[0].id;
            let res = conn.querySync(`SELECT file FROM project WHERE author = '${idUs}'`);
            let samename = false;
            if(res.length > 0){
                for (let i = 0; i < res.length; i++) {
                    if(res[i].file === project.file){
                        samename = true;
                    }
                }
            }
            if(samename) {
               return {
                   message: null,
                   error: "Проект с данным именем уже существует. Пожалуйста, выберете другое имя"
                }
            } else {
                conn.querySync(`INSERT into project(file, datecreation, datelastmodified, depth, author)` + 
                `VALUES('${project.file}','${project.datecreate}','${project.datemodified}',${project.depth}, ${idUs});`);
                return {
                    message: "Проект успешно создан",
                    error: null
                }
            }
        } else { 
            return {
                message: null,
                error: "Пользователь не найден"
             }
        }
        
    },

    deleteProject: function (conn, file) {
        let row = conn.querySync(`SELECT version.id FROM version JOIN project ON proot = project.id WHERE file = '${file}' `);
        if(row.length > 0){
            for (let i = 0; i < row.length; i++) {
                resId = row[i].id;
                conn.querySync(`DELETE FROM version WHERE id = '${resId}'`);
            }
        }
        conn.querySync(`DELETE FROM project WHERE file = '${file}'`);
    },
   createProjectInV: function(conn, email, project){
    let row = conn.querySync(`SELECT id FROM users WHERE email = '${email}'`);
    if(row.length > 0){
        let idUs = row[0].id;
        let res = conn.querySync(`SELECT file FROM project WHERE author = '${idUs}'`);
        let samename = false;
        if(res.length > 0){
            for (let i = 0; i < res.length; i++) {
                if(res[i].file === project.file){
                    samename = true;
                }
            }
        }
        if(samename) {
           return {
               message: null,
               error: "Проект с данным именем уже существует. Пожалуйста, выберете другое имя"
            }
        } else {
            let row = conn.querySync(`SELECT data, depth FROM version JOIN project ON proot = project.id WHERE version.id = ${project.rootver}`);
            if(row.length > 0){  
                conn.querySync(`INSERT into project(file, datecreation, datelastmodified, depth, author)` + 
                `VALUES('${project.file}','${project.datecreate}','${project.datemodified}',${row[0].depth}, ${idUs});`);
                let res = conn.querySync(`SELECT id FROM project WHERE file ='${project.file}'`);
                conn.querySync(`INSERT into version(version, datecreation, datemodified, data, proot, authorv)` + 
                    `VALUES('version 1', '${project.datecreate}', '${project.datecreate}', '${row[0].data}', ${res[0].id}, ${idUs});`);
                return {
                    message: "Проект успешно создан",
                    error: null
                }
            }
        }
    } else { 
        return {
            message: null,
            error: "Пользователь не найден"
         }
    }
    
   }
};
