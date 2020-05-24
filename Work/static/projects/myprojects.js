function deleteProject(file) {
    console.log(`name = ${file}`);
    fetch(`http://localhost:3000/api/projects?file=${file}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    });
    document.getElementById("projectTable").remove();
    let table = document.createElement("table");
    table.id = "projectTable";
    document.getElementById("proj").appendChild(table);
    showprojects();
}


async function showprojects(){
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
                let tdFile = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");
                let tdDepth = document.createElement("td");

                let button = document.createElement("input");
                button.type = "button";
                //button.addEventListener("click", () => deleteUser(response.users[i].email));
                button.value = "Редактировать";
                let delbutton = document.createElement("input");
                delbutton.type = "button";
                delbutton.addEventListener("click", () => deleteProject(response.projects[i].file))
                delbutton.value = "Удалить";

                tdFile.innerText = response.projects[i].file;
                let tempdatecreate = new Date(response.projects[i].datecreate).toDateString();
                let tempdatemodified = new Date(response.projects[i].datemodified).toDateString();
                console.log(tempdatecreate);
                //tdDate.innerText = response.projects[i].datecreate;
                tdDate.innerText = tempdatecreate;
                tdDateM.innerText = tempdatemodified;
                tdAuthor.innerText = response.projects[i].author;
                tdDepth.innerText = response.projects[i].depth;

                tr.appendChild(tdFile);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM)
                tr.appendChild(tdAuthor);
                tr.appendChild(tdDepth);
                tr.appendChild(button);
                tr.appendChild(delbutton);

                table.appendChild(tr);
            }
        });
        /*if (response.status !== 200) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } else {
            response.json().then(response => {
                namefileIinput.value = response.name;
                datecreateInput.value = response.datecreate;
                authorInput.value = response.author;
            });
        }*/
    })
}

function showForm(){
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function createProject(){
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
    })
    document.getElementById("projectTable").remove();
    let table = document.createElement("table");
    table.id = "projectTable";
    document.getElementById("proj").appendChild(table);
    showprojects();
}


showprojects();
