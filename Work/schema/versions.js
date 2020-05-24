module.exports.versionSchema = `
    create table version(
        id serial not null primary key,
        version integer not null,
        datecreation timestamp with time zone,
        data text,
        proot integer,
        author integer,
        constraint id_project foreign key (proot)
        references public.project (id) match simple
            on update restrict
            on delete restrict,
        constraint id_user foreign key (author)
        references public.users (id) match simple
            on update restrict
            on delete restrict
    )
`;