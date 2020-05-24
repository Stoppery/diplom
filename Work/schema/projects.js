module.exports.projectSchema = `
    create table project(
        id serial not null primary key,
        file varchar(255) not null unique,
        datecreation timestamp with time zone,
        datelastmodified timestamp with time zone,
        depth integer,
        author integer,
        constraint id_user foreign key (author)
        references public.users (id) match simple
            on update restrict
            on delete restrict
    )
`;
