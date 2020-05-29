async function showVersion(){
    let version = document.location.search.substring(document.location.search.indexOf('=') + 1);
    console.log(version);
   fetch(`http://localhost:3000/api/versions?ver=${version}`, {
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
            let table = document.getElementById("versionTable");
            let tr = document.createElement("tr");
            let tdVersion = document.createElement("td");
            let tdDate = document.createElement("td");
            let tdDateM = document.createElement("td");

            let savebutton = document.createElement("input");
            let tdSaveBut = document.createElement("td");
            savebutton.type = "button";
            savebutton.title = "Сохранение версии проекта";
            savebutton.addEventListener("click", () => saveVersion(version));
            savebutton.value = "Сохранить";
            savebutton.setAttribute("class", "button-table");

            let saveasbutton = document.createElement("input");
            let tdSaveAsBut = document.createElement("td");
            saveasbutton.type = "button";
            saveasbutton.addEventListener("click", () => document.location.href = `../versions/create?ver=${version}`);
            saveasbutton.value = "Создать новую версию";
            saveasbutton.title = "Создание новой версии на базе текущей";
            saveasbutton.setAttribute("class", "button-table");

           /* let createbutton = document.createElement("input");
            let tdCrBut = document.createElement("td");
            createbutton.type = "button";
            createbutton.addEventListener("click", () => createProjectInV(version));
            createbutton.value = "Создать новый проект";
            createbutton.title = "Создание нового проекта на базе текущей версии";*/

            tdVersion.innerText = response.versions[0].version;
            let tempdatecreate = new Date(response.versions[0].datecreate).toLocaleString("ru");
            tdDate.innerText = tempdatecreate;
            let tempdatemodified = new Date(response.versions[0].datemodified).toLocaleString("ru");
            tdDateM.innerText = tempdatemodified;

            tdSaveBut.appendChild(savebutton);
            tdSaveAsBut.appendChild(saveasbutton);
           // tdCrBut.appendChild(createbutton);
            tr.appendChild(tdVersion);
            tr.appendChild(tdDate);
            tr.appendChild(tdDateM);
            tr.appendChild(tdSaveBut);
            tr.appendChild(tdSaveAsBut);
            //tr.appendChild(tdCrBut);
            table.appendChild(tr);
                  /*let tdCreate = document.createElement("td");
                let createbutton = document.createElement("input");
                createbutton.setAttribute("id","but" + response.versions[i].id);
                createbutton.type = "button";
                createbutton.value = "Создать новую версию";
                createbutton.addEventListener("click", () => document.location.href = `../versions/create?file=${response.versions[i].root}`);
                tdCreate.appendChild(createbutton);
                tr.appendChild(tdCreate);*/
        });
    })
}

function saveVersion(version) {
    let newDate = new Date().toUTCString();
    let versions = {
        id: version,
        datemodified: newDate,
    };

    fetch('http://localhost:3000/api/versions', {
        method: 'POST',
        body: JSON.stringify(versions),
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        if (response.status !== 200) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } 
    })
    document.getElementById("versionTable").remove();
    let table = document.createElement("table");
    table.id = "versionTable";
    document.getElementById("proj").appendChild(table);
    showVersion();
}


function showForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function createProjectInV() {
    let version = document.location.search.substring(document.location.search.indexOf('=') + 1);
    let nameInput = document.getElementById("file");

    let project = {
        file: nameInput.value,
        rootver: version, 
    };

    fetch('http://localhost:3000/api/projects/version', {
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
            response.json().then(response => {
                let message = document.getElementById("message");
                message.innerText = response.message;
            });
        }
    });
    window.location.href = `../projects`;
}


showVersion();