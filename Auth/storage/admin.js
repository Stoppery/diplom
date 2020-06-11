const Client = require('pg-native');
const proj = require('../../Work/schema/projects');
const vers = require('../../Work/schema/versions');
const tg = require('../../Work/schema/tag');
const tg_ver = require('../../Work/schema/tag_project');

const userSchema = `
    create table users (
        id serial not null primary key,
        name     varchar(255) not null,
        surname  varchar(255) not null,
        phone    varchar(255) not null unique,
        email    varchar(255) not nuLL unique,
        password varchar(255) not null,
        status   boolean      not null,
        "group"  varchar(255) not null
    )
`;

module.exports.admin = {
    createDB: async function (host, user, password, port, name) {
        let client = new Client();
        client.connectSync(`postgresql://${user}:${password}@${host}:${port}/${user}`);
        await client.querySync(`CREATE DATABASE ${name}`);
        client.connectSync(`postgresql://${user}:${password}@${host}:${port}/${name}`);
        await client.querySync(userSchema);
        await client.querySync(proj.projectSchema);
        await client.querySync(vers.versionSchema);
        await client.querySync(tg.tagSchema);
        await client.querySync(tg_ver.tagProjectSchema);
    },
    checkDB: async function (conn) {
        await conn.querySync(tg.tagSchema);
        await conn.querySync(tg_ver.tagProjectSchema);
    }
};