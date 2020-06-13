module.exports.project = {
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

        result.error = "Не удалось получить информацию о проектах";
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

        result.error = "В вашей компании нет других проектов";
        return result
    },

    createProject: function(conn, email, project){
        let row = this.getUserId(conn,email);
        if(row.length > 0){
            let idUs = row[0].id;
            let samename = this.checkName(conn, idUs, project);
            if(samename) {
               return {
                   error: "Проект с данным именем уже существует. Пожалуйста, выберете другое имя"
                }
            } else {
                let res = conn.querySync(`INSERT into project(file, datecreation, datelastmodified, depth, author)` +
                `VALUES('${project.file}','${project.datecreate}','${project.datemodified}',${project.depth}, ${idUs})` + ` RETURNING id;`);
                console.log(res);
                return {
                    error: null
                }
            }
        } else { 
            return {
                error: "Пользователь не найден"
             }
        }
        
    },

    deleteProject: function (conn, file) {
        let row = conn.querySync(`SELECT version.id FROM version WHERE proot = '${file}' `);
        if(row.length > 0){
            for (let i = 0; i < row.length; i++) {
                resId = row[i].id;
                conn.querySync(`DELETE FROM version WHERE id = '${resId}'`);
            }
        }
        conn.querySync(`DELETE FROM project_tag WHERE project = ${file}`);
        let res = conn.querySync(`DELETE FROM project WHERE id = '${file}' RETURNING id`);
        console.log(res);
        
    },

   createProjectInV: function(conn, email, project){
    let row = this.getUserId(conn,email);
    if(row.length > 0){
        let idUs = row[0].id;
        let samename = this.checkName(conn, idUs, project);
        if(samename) {
           return {
               error: "Проект с данным именем уже существует. Пожалуйста, выберете другое имя"
            }
        } else {
            let row = conn.querySync(`SELECT version, data, depth, proot FROM version JOIN project ON proot = project.id WHERE version.id = ${project.rootver}`);
            if(row.length > 0){  
                conn.querySync(`INSERT into project(file, datecreation, datelastmodified, depth, author)` + 
                    `VALUES('${project.file}','${project.datecreate}','${project.datemodified}',${row[0].depth}, ${idUs});`);
                let newVersion = this.createVersionFromParent(conn, row, project, idUs);
                console.log(newVersion);
                if(newVersion.error != null) {
                    return {
                        error: newVersion.error
                    }
                } else {
                    this.addParentTags(newVersion.idP, row[0].proot, conn);
                    return {
                        error: null
                    }
                }
            }
        }
    } else { 
        return {
            error: "Пользователь не найден"
         }
    }
   },

   getUserId: function(conn, email){
    let rows = conn.querySync(`SELECT id FROM users WHERE email='${email}'`);
    return rows;
    },   

   checkName: function(conn, idUs, project){
    let res = conn.querySync(`SELECT file FROM project WHERE author = '${idUs}'`);
    let samename = false;
    if(res.length > 0){
        for (let i = 0; i < res.length; i++) {
            if(res[i].file === project.file){
                samename = true;
            }
        }
    } 
    return samename;
    },

    createVersionFromParent: function(conn, row, project, idUs){
        let res = conn.querySync(`SELECT id FROM project WHERE file ='${project.file}' AND author = ${idUs}`);
            if(res.length > 0){
                conn.querySync(`INSERT into version(version, datecreation, datemodified, data, proot, authorv)` + 
                    `VALUES('${row[0].version}', '${project.datecreate}', '${project.datecreate}', '${row[0].data}', ${res[0].id}, ${idUs});`);
                return {
                        error: null,
                        idP: res[0].id
                        }
            }else {
                conn.querySync(`DELETE FROM project WHERE file = '${project.file} AND author = ${idUs}'`);
                return {
                        error: "Не удалось создать проект",
                        idP: null
                     }
            }
    },

    addParentTags: function(projectId, rootId, conn){
        let row = conn.querySync(`SELECT tag FROM project_tag WHERE project=${rootId}`);
        if(row.length > 0){
            for(let i = 0; i < row.length; i++){
                conn.querySync(`INSERT into project_tag(tag, project) VALUES(${row[i].tag}, ${projectId});`);
            }
        }
        return
    },

   addTag: function(conn, tag){
    let row = conn.querySync(`SELECT authorv, proot FROM version WHERE id=${tag.rootver}`);
    if(row.length > 0){
        let idNew = conn.querySync(`WITH new_tag as (INSERT INTO tag(description) VALUES('${tag.description}') ON CONFLICT(description) DO NOTHING RETURNING *) ` +
        `SELECT id FROM new_tag WHERE description = '${tag.description}'`);
        console.log(idNew);
        if(idNew.length > 0){
            conn.querySync(`INSERT INTO project_tag(tag, project) VALUES(${idNew[0].id}, ${row[0].proot});`);
            return {
                error: null
            }   
        } else {
            return {
                error: "Что-то пошло не так",
            }
        }
       
    } else {
        return {
            error: "Что-то пошло не так",
        }
    }
   },

   removeTag: function(conn, tagData){
       conn.querySync(`DELETE from project_tag WHERE tag=${tagData.tagId} AND project=${tagData.projectId}`);
       let row = conn.querySync(`SELECT tag.id FROM tag LEFT OUTER JOIN project_tag ON tag.id=project_tag.tag WHERE project_tag.tag IS NULL`);
       if(row.length > 0){
           for(let i=0; i < row.length; i++){
            conn.querySync(`DELETE FROM tag WHERE id=${row[i].id}`);
           }
       }
   },

   createSearch: function(conn){
       let rows = conn.querySync(`SELECT id, name, surname FROM users WHERE "group"='user'`);
       let res = conn.querySync(`SELECT id, description FROM tag`);
       let result = {
        users: [],
        tags: [],
        error: null,
        };
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                result.users.push({
                    id: rows[i].id,
                    name: rows[i].name,
                    surname: rows[i].surname,
                })
            }
            if(res.length > 0){
                for(let i = 0; i < res.length; i++){
                    result.tags.push({
                        id: res[i].id,
                        description: res[i].description,
                    })
                }
            }
            return result;
        }

        result.error = "Не удалось обработать информацию для поиска";
        return result;
   },

   searchProjects: function (conn, searchData, email) {
    let startQuery = ``;
    let count = 0;
    let filters = searchData;
    let flag = false;

    for(let key in searchData){
        if(searchData[key] != "") {
            count++;
        } else{
            delete filters[key];
        }
    }
    
    keys = Object.keys(filters);
    if (typeof filters['tag'] !== "undefined") {
       flag = true;
    }
    if(flag){
        startQuery = `SELECT p.id, file, datecreation, datelastmodified, users.name, users.email, depth, description FROM project as p JOIN users ON author=users.id JOIN project_tag ON p.id = project_tag.project JOIN tag ON project_tag.tag=tag.id `; 
    } else {
        startQuery = `SELECT DISTINCT p.id, file, datecreation, datelastmodified, users.name, users.email, depth FROM project as p JOIN users ON author=users.id `;
    }

    let fieldName;
    let endQuery = ``;
    let lastQuery = ``;
    let orderQuery = ``;

    endQuery += startQuery + `WHERE`;

    for(let i = 1; i <= count; i++ ) {
        fieldName = this.searchKey(keys, i - 1);
        lastQuery = this.searchInstruction(fieldName, filters);
        endQuery += lastQuery;
        if(count > 1 && i != count){
            endQuery += ` AND`;
        }
    }
  
    // console.log(endQuery);
    
    if(flag) {
        orderQuery = endQuery + ` ORDER BY p.id`;
    }else {
        orderQuery = endQuery + ` ORDER BY datelastmodified DESC`;
    }
    

    let rows = conn.querySync(orderQuery);
    let result = {
        projects: [],
        error: null,
    };

    if (rows.length > 0) {

        if(flag){
            result = this.resultForTags(rows, email, result);
        }else{
        for (let i = 0; i < rows.length; i++) {
            let check = (rows[i].email === email)?true:false;
                result.projects.push({
                    id: rows[i].id,
                    file: rows[i].file,
                    datecreate: rows[i].datecreation,
                    datemodified: rows[i].datelastmodified,
                    author: rows[i].name,
                    depth: rows[i].depth,
                    isAuthor: check,
                })
            }
            
        }
        return result;
    }
    result.error = "Проекты не найдены. Попробуйте изменить параметры поиска";
    return result;
},
    searchKey: function (keys, i){
            switch(keys[i]){
                case "fileName": 
                    return "file";
                case "authorName":
                    return "author";
                case "startDateCreate":
                    return "datecreation1";
                case "endDateCreate":
                    return "datecreation2";
                case "startDateMod":
                    return "datelastmodified1";
                case "endDateMod":
                    return "datelastmodified2";
                case "tag":
                    return "description";
                default: 
                    return "";
            }
    },

    searchInstruction: function(fieldName, filters){
        switch(fieldName){
            case "file": {
                let searchName = filters["fileName"] + "%";
                return ` ${fieldName} LIKE '${searchName}'`;
            }
            case "author": {
                return ` ${fieldName} = ${filters["authorName"]}`;
            }
            case "datecreation1": {
                let field = fieldName.slice(0, fieldName.length -1);
                return ` ${field} >= '${filters["startDateCreate"]}'`;
            }
            case "datecreation2": {
                let field = fieldName.slice(0, fieldName.length -1);
                return ` ${field} <= '${filters["endDateCreate"]}'`;
            }
            case "datelastmodified1": {
                let field = fieldName.slice(0, fieldName.length -1);
                return ` ${field} >= '${filters["startDateMod"]}'`;
            }
            case "datelastmodified2": {
                let field = fieldName.slice(0, fieldName.length -1);
                return ` ${field} <= '${filters["endDateMod"]}'`;
            }
            case "description":{
                if(filters["tag"].includes(" ")){
                    let str = filters["tag"];
                    let arrayOfStrings = str.split(' ');
                    let query = ``;
                    for(let i = 0; i < arrayOfStrings.length; i++){
                        query += ` ${fieldName} = '${arrayOfStrings[i]}'`;
                        if(i != arrayOfStrings.length - 1){
                            query += ` OR`; 
                        }
                    }
                    return query;
                }else {
                    return ` ${fieldName} = '${filters["tag"]}'`;
                }
            }
        }
    },

    resultForTags: function(rows, email, result){
        let quantity = [];
            let summa = 1;
            for(let k = 0; k < rows.length -1; k++){
                if(rows[k].id == rows[k+1].id){
                    summa += 1;
                    if(k == rows.length - 2){
                        quantity.push({
                            id: rows[k].id,
                            k: k+1,
                            sum: summa,
                        })
                    }
                } else { 
                    quantity.push({
                        id: rows[k].id,
                        k: k,
                        sum: summa,
                    })
                    summa = 1;
                }
            }
            quantity.sort(function(a, b){
                return a.sum-b.sum
              }).reverse()

        
            for (let i = 0; i < quantity.length; i++) {
                let ind = quantity[i].k;
                let check = (rows[ind].email === email)?true:false;
                result.projects.push({
                    id: rows[ind].id,
                    file: rows[ind].file,
                    datecreate: rows[ind].datecreation,
                    datemodified: rows[ind].datelastmodified,
                    author: rows[ind].name,
                    depth: rows[ind].depth,
                    isAuthor: check,
                })
            }
            return result;
    }
   
}
