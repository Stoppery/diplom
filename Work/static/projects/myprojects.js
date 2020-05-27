function deleteProject(file) {
    let isConfirmed = confirm('Удалить проект?');
    if(isConfirmed){
    fetch(`http://localhost:3000/api/projects?file=${file}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    });}
    document.getElementById("projectTable").remove();
    let table = document.createElement("table");
    table.id = "projectTable";
    document.getElementById("proj").appendChild(table);
    showprojects();
}


async function showprojects() {
    fetch('http://localhost:3000/api/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {

        response.json().then(response => {
            let table = document.getElementById("projectTable");

            for (let i = 0; i < response.projects.length; i++) {
                let tr = document.createElement("tr");

                tr.setAttribute("id", response.projects[i].id);

                let tdFile = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");
                let tdDepth = document.createElement("td");

                let button = document.createElement("input");
                button.type = "button";
                button.addEventListener("click", () => showversions(response.projects[i].file));
                button.value = "Редактировать";
                let delbutton = document.createElement("input");
                delbutton.type = "button";
                delbutton.addEventListener("click", () => deleteProject(response.projects[i].file))
                delbutton.value = "Удалить";

                tdFile.innerText = response.projects[i].file;
                let tempdatecreate = new Date(response.projects[i].datecreate).toLocaleString("ru");
                let tempdatemodified = new Date(response.projects[i].datemodified).toLocaleString("ru");
                tdDate.innerText = tempdatecreate;
                tdDateM.innerText = tempdatemodified;
                tdAuthor.innerText = response.projects[i].author;
                tdDepth.innerText = response.projects[i].depth;

                tr.appendChild(tdFile);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM);
                tr.appendChild(tdAuthor);
                tr.appendChild(tdDepth);
                tr.appendChild(button);
                tr.appendChild(delbutton);

                
                table.appendChild(tr);
            }
        });
    })
}

function showForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function createProject() {
    let nameInput = document.getElementById("file");
    let depthInput = document.getElementById("depth");

    let project = {
        file: nameInput.value,
        depth: depthInput.value,
    };

    fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    }).then(response => {
        if (response.status >= 300) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } else {
            nameInput.value = "";
            depthInput.value = "";
        }
    });
    document.getElementById("projectTable").remove();
    let table = document.createElement("table");
    table.id = "projectTable";
    document.getElementById("proj").appendChild(table);
    showprojects();
}



function showversions(file) {
    fetch(`http://localhost:3000/api/projects/version?file=${file}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        response.json().then(response => {
            if (response.versions.length === 0) {
                return
            }

            for (let i = 0; i < response.versions.length; i++) {
                if (document.getElementById("ep" + response.versions[i].id)) {
                    continue
                }

                let parentElement = document.getElementById(response.versions[i].root);
                let tr = document.createElement("tr");
                tr.setAttribute("id", "ep" + response.versions[i].id);

                let tdEmpty = document.createElement("td");
                let tdVersion = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");

                let button = document.createElement("input");
                button.type = "button";
                button.addEventListener("click", () => document.location.href = `../versions?ver=${response.versions[i].id}`);
                button.value = "Редактировать";

                let tdButton = document.createElement("td");
                tdButton.appendChild(button);

                let delbutton = document.createElement("input");
                delbutton.type = "button";
                delbutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
                delbutton.value = "Удалить";

                let tdDelbutton = document.createElement("td");
                tdDelbutton.appendChild(delbutton);

                tdVersion.innerText = response.versions[i].version;
                let tempdatecreate = new Date(response.versions[i].datecreate).toLocaleString("ru");
                tdDate.innerText = tempdatecreate;
                let tempdatemodified = new Date(response.versions[i].datemodified).toLocaleString("ru");
                tdDateM.innerText = tempdatemodified;
                tdAuthor.innerText = response.versions[i].author;

                tr.appendChild(tdEmpty);
                tr.appendChild(tdVersion);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM);
                tr.appendChild(tdAuthor);
                tr.appendChild(tdButton);
                tr.appendChild(tdDelbutton);

                let tdCreate = document.createElement("td");
                let createbutton = document.createElement("input");
                createbutton.setAttribute("id","but" + response.versions[i].id);
                createbutton.type = "button";
                createbutton.value = "Создать новую версию";
                createbutton.addEventListener("click", () => document.location.href = `../versions/create?file=${response.versions[i].root}`);
                tdCreate.appendChild(createbutton);
                tr.appendChild(tdCreate);
                parentElement.after(tr);
                    
            }
        });

    })
}


function deleteVersion(ver){
    let isConfirmed = confirm('Удалить версию?');
    if(isConfirmed){
    fetch(`http://localhost:3000/api/projects/version?ver=${ver}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    });
    }
    document.getElementById("projectTable").remove();
    let table = document.createElement("table");
    table.id = "projectTable";
    document.getElementById("proj").appendChild(table);
    showprojects();
}

showprojects();