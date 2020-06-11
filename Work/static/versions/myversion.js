async function showVersion(){
    let searchURL = new URL(document.location.href);
    let version = searchURL.searchParams.get("ver");
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
            // saveasbutton.addEventListener("click", () => document.location.href = `../versions/create?ver=${version}`);
            saveasbutton.addEventListener("click", () => showCreateVersionForm());
            saveasbutton.value = "Создать новую версию";
            saveasbutton.title = "Создание новой версии на базе текущей";
            saveasbutton.setAttribute("class", "button-table");

            let tagButtonCr = document.createElement("input");
            let tdTagButtonCr = document.createElement("td");
            tagButtonCr.type = "button";
            tagButtonCr.value = "Добавить тег";
            tagButtonCr.title = "Добавить тег к проекту";
            tagButtonCr.addEventListener("click", () => showTagForm());
            tagButtonCr.setAttribute("class", "button-table");

            tdVersion.innerText = response.versions[0].version;
            let tempdatecreate = new Date(response.versions[0].datecreate).toLocaleString("ru");
            tdDate.innerText = tempdatecreate;
            let tempdatemodified = new Date(response.versions[0].datemodified).toLocaleString("ru");
            tdDateM.innerText = tempdatemodified;

            tdSaveBut.appendChild(savebutton);
            tdSaveAsBut.appendChild(saveasbutton);
            tdTagButtonCr.appendChild(tagButtonCr);
            tr.appendChild(tdVersion);
            tr.appendChild(tdDate);
            tr.appendChild(tdDateM);
            tr.appendChild(tdSaveBut);
            tr.appendChild(tdSaveAsBut);
            tr.appendChild(tdTagButtonCr);
            table.appendChild(tr);

            if(response.tags.length > 0){
                console.log("length ", response.tags.length);
                let tableTag = document.getElementById("tagsTable");
                let trTag = document.createElement("tr");
                for(let i = 0; i < response.tags.length; i++){
                    let temp = document.createElement("input");
                    temp.type = "button";
                    temp.value = response.tags[i].description;
                    temp.setAttribute("id", response.tags[i].tagId);
                    temp.setAttribute("class", "button-tag");
                    temp.addEventListener("click", () => removeTag(response.tags[i].tagId, response.tags[i].projectId, version));
                    tdTemp = document.createElement("td");
                    tdTemp.appendChild(temp);
                    if(trTag.childElementCount > 4){
                        tableTag.appendChild(trTag);
                        trTag = document.createElement("tr");
                    }
                    trTag.appendChild(tdTemp);
                }
                tableTag.appendChild(trTag);
            }
          

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
    document.getElementById("tagsTable").remove();
    let tableTag = document.createElement("table");
    tableTag.id = "tagsTable";
    document.getElementById("tags").appendChild(tableTag);
    showVersion();
}

function showCreateVersionForm() {
    document.getElementById("createVersionForm").style.display = "block";
}

function closeCreateVersionForm() {
    document.getElementById("createVersionForm").style.display = "none";
}

function showForm() {
    document.getElementById("versionForm").style.display = "block";
}

function closeForm() {
    document.getElementById("versionForm").style.display = "none";
}

function createVersion() {
    let nameInput = document.getElementById("nameNewVersion");
    let searchURL = new URL(document.location.href);
    let rootId = searchURL.searchParams.get("ver");
    let version = {
        name: nameInput.value,
        rootver: rootId,
    };

    fetch('http://localhost:3000/api/versions/create', {
        method: 'POST',
        body: JSON.stringify(version),
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
                let idVer = response.idV;
                window.location.href = `/versions?ver=${idVer}`;
            });
            
        }
    });

}

function createProjectInV() {
    let nameInput = document.getElementById("file");
    let searchURL = new URL(document.location.href);
    let version = searchURL.searchParams.get("ver");
    console.log(version);

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
            window.location.href = `../projects`;
        }
    });
    
}

function showTagForm() {
    createSearchForm();
    document.getElementById("tagForm").style.display = "block";
}

function closeTagForm() {
    document.getElementById("tagForm").style.display = "none";
}

function createSearchForm(){
    fetch('http://localhost:3000/api/projects/createSearch', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        response.json().then(response => {
            if (response.tags.length === 0) {
                return
            }
            let tableTag = document.getElementById("tags table");
                let trTag = document.createElement("tr");
                console.log(response.tags.length);
            for(let i = 0; i < response.tags.length; i++){
                if (document.getElementById("tag" + response.tags[i].id)) {
                    continue
                }
                let temp = document.createElement("input");
                temp.type = "button";
                temp.value = response.tags[i].description;
                temp.setAttribute("id","tag" + response.tags[i].id);
                temp.setAttribute("class", "button-tag-search");
                temp.addEventListener("click", () => document.getElementById("description").value += (`${response.tags[i].description}`));
                tdTemp = document.createElement("td");
                tdTemp.appendChild(temp);
                if(trTag.childElementCount > 4){
                    tableTag.appendChild(trTag);
                    trTag = document.createElement("tr");
                }
                    trTag.appendChild(tdTemp);
            
            }
            tableTag.appendChild(trTag);
        })
    })
}



function addTag(){
    let version = document.location.search.substring(document.location.search.indexOf('=') + 1);
    let nameInput = document.getElementById("description");
    let tag = {
        id: version,
        description: nameInput.value
    };

    fetch('http://localhost:3000/api/versions/tag', {
        method: 'POST',
        body: JSON.stringify(tag),
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
        }else {
            nameInput.value = "";
        } 
    })
    saveVersion(tag.id);
}

function removeTag(tag, project, version){
    let rmTag = {
        tagId: tag,
        projectId: project
    }
    let isConfirmed = confirm('Удалить тег?');
    if(isConfirmed){
    fetch(`http://localhost:3000/api/versions/tag`, {
        method: 'DELETE',
        body: JSON.stringify(rmTag),
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    });}
    saveVersion(version);
}

showVersion();