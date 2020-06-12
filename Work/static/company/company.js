async function showallprojects(){
    fetch('http://localhost:3000/api/company', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        
        response.json().then(response => {
            let table = document.getElementById("projectTable");
            let tdName = document.createElement("td");
            let tdDC = document.createElement("td");
            let tdDM = document.createElement("td");
            let tdA = document.createElement("td");
            let tdP = document.createElement("td");
            let tr = document.createElement("tr");
            tdName.innerText = "Название";
            tdDC.innerText = "Дата создания";
            tdDM.innerText = "Дата изменения";
            tdA.innerText = "Автор";
            tdP.innerText = "Параметр";
            tr.appendChild(tdName);
            tr.appendChild(tdDC);
            tr.appendChild(tdDM);
            tr.appendChild(tdA);
            tr.appendChild(tdP);
            table.appendChild(tr);

            for (let i = 0; i < response.projects.length; i++) {
                let tr = document.createElement("tr");
                tr.setAttribute("class", "themed-grid-col col-sm-8");
                tr.setAttribute("id", response.projects[i].id);

                let tdFile = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");
                let tdDepth = document.createElement("td");

                let button = document.createElement("input");
                let tdBut = document.createElement("td");
                button.type = "button";
                //button.addEventListener("click", () => deleteUser(response.users[i].email));
                button.value = "Клонировать";
                button.setAttribute("class", "button-table");
                let watchbutton = document.createElement("input");
                let tdWBut = document.createElement("td");
                watchbutton.type = "button";
                watchbutton.value = "Версии";
                watchbutton.addEventListener("click",  () => showversions(response.projects[i].id));
                watchbutton.setAttribute("class", "button-table");
                
                let tempdatecreate = new Date(response.projects[i].datecreate).toLocaleString("ru");
                let tempdatemodified = new Date(response.projects[i].datemodified).toLocaleString("ru");
                tdFile.innerText = response.projects[i].file;
                tdDate.innerText = tempdatecreate;
                tdDateM.innerText = tempdatemodified;
                tdAuthor.innerText = response.projects[i].author;
                tdDepth.innerText = response.projects[i].depth;

                tdBut.appendChild(button);
                tdWBut.appendChild(watchbutton);
                tr.appendChild(tdFile);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM)
                tr.appendChild(tdAuthor);
                tr.appendChild(tdDepth);
                tr.appendChild(tdBut);
                tr.appendChild(tdWBut);

                table.appendChild(tr);
            }

        });
    })
}


function showversions(file) {
    fetch(`http://localhost:3000/api/company/versions?file=${file}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        response.json().then(response => {
            if (response.versions.length === 0) {
                alert("В вашей компании еще нет версий проектов");
                return
            }
            console.log(response.versions.length);
            let len = response.versions.length;
            for (let i = 0; i < len; i++) {
                let close = document.getElementById("ep" + response.versions[i].id);
                  
                if (close) {
                    close.remove();
                    continue;
                }
                console.log(response.versions[i]);
                let parentElement = document.getElementById(response.versions[i].root);
                let tr = document.createElement("tr");
                tr.setAttribute("id", "ep" + response.versions[i].id);
                tr.setAttribute("class", "themed-grid-col col-sm-8");

                let tdEmpty = document.createElement("td");
                let tdVersion = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");

                let button = document.createElement("input");
                let tdBut = document.createElement("td");
                button.type = "button";
                button.addEventListener("click", () => document.location.href = `/company/version?ver=${response.versions[i].id}`);
                button.value = "Просмотр";
                button.setAttribute("class", "button-table");

                let clonebutton = document.createElement("input");
                let tdCBut = document.createElement("td");
                clonebutton.type = "button";
                //delbutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
                clonebutton.value = "Клонировать";
                clonebutton.setAttribute("class", "button-table");

                tdVersion.innerText = response.versions[i].version;
                let tempdatecreate = new Date(response.versions[i].datecreate).toLocaleString("ru");
                tdDate.innerText = tempdatecreate;
                let tempdatemodified = new Date(response.versions[i].datemodified).toLocaleString("ru");
                tdDateM.innerText = tempdatemodified;
                tdAuthor.innerText = response.versions[i].author;

                tdBut.appendChild(button);
                tdCBut.appendChild(clonebutton);
                tr.appendChild(tdEmpty);
                tr.appendChild(tdVersion);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM);
                tr.appendChild(tdAuthor);
                tr.appendChild(tdCBut);
                tr.appendChild(tdBut);
                

                parentElement.after(tr);
            }
            if (!document.getElementById("nametr" + response.versions[len - 1].root)) {
                let tdEmpty = document.createElement("td");
                let tdName = document.createElement("td");
                let tdDC = document.createElement("td");
                let tdDM = document.createElement("td");
                let tdA = document.createElement("td");
                let trp = document.createElement("tr");
                trp.setAttribute("id", "nametr" + response.versions[len - 1].root)
                tdName.innerText = "Название";
                tdDC.innerText = "Дата создания";
                tdDM.innerText = "Дата изменения";
                tdA.innerText = "Автор";
                trp.appendChild(tdEmpty);
                trp.appendChild(tdName);
                trp.appendChild(tdDC);
                trp.appendChild(tdDM);
                trp.appendChild(tdA);
                let parentElement = document.getElementById(response.versions[len - 1].root);
                parentElement.after(trp);
            } else {
                document.getElementById("nametr" + response.versions[len - 1].root).remove();
            }
        });

    })
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
            if (response.users.length === 0) {
                return
            }
            for(let i=0; i < response.users.length; i++){
                if (document.getElementById("auth" + response.users[i].id)) {
                    continue
                }
                let opt = document.createElement("option");
                opt.value = response.users[i].id;
                opt.innerText = response.users[i].name + " " + response.users[i].surname;
                opt.setAttribute("id", "auth" + response.users[i].id)
                document.getElementById("author search").appendChild(opt);
            }
            if(response.tags.length > 0){
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
                temp.addEventListener("click", () => document.getElementById("tags search").value += (`${response.tags[i].description}` + '+'));
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
        })
    })
}


function searchFormOn(){
    document.getElementById("rowSearch 1").style.display = "none";
    document.getElementById("proj").style.display = "none";
    document.getElementById("myproj").style.display = "none";

    document.getElementById("searchForm").style.display = "block";
    createSearchForm();
}

function searchFormOff(){
    document.getElementById("searchForm").style.display = "none";
    document.getElementById("rowSearch 1").style.display = "block";
    document.getElementById("myproj").style.display = "block";
    document.getElementById("proj").style.display = "block";
}

function searchProjects(){
    let nameInput = document.getElementById("project search").value;
    let authorInput = document.getElementById("author search").value;
    let createStart = document.getElementById("start create").value;
    let createEnd = document.getElementById("end create").value;
    let modStart = document.getElementById("start modif").value;
    let modEnd = document.getElementById("end modif").value;
    let tags = document.getElementById("tags search").value;
    console.log(tags);
    window.location.href = `../search?name=${nameInput}&author=${authorInput}&dateCrSt=${createStart}&dateCrEnd=${createEnd}&dateModSt=${modStart}&dateModEnd=${modEnd}&tags=${tags}`;
}

showallprojects();