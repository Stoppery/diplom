module.exports.tagSchema = `
    create table if not exists tag(
        id serial not null primary key,
        description varchar(255) unique not null
    )
`;