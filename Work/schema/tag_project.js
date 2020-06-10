module.exports.tagProjectSchema = `
    create table if not exists project_tag(
        id serial not null primary key,
        tag integer,
        project integer,
        constraint id_tag foreign key (tag)
        references public.tag(id) match simple
            on update restrict
            on delete restrict,
        constraint id_project foreign key (project)
        references public.project (id) match simple
            on update restrict
            on delete restrict
    )
`;