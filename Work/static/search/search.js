async function showprojects() {
    let searchURL = new URL(document.location.href);
    console.log(document.location.href);
    let nameInput = searchURL.searchParams.get("name");
    let authorInput = searchURL.searchParams.get("author");
    let createStart = searchURL.searchParams.get("dateCrSt");
    let createEnd = searchURL.searchParams.get("dateCrEnd");
    let modStart = searchURL.searchParams.get("dateModSt");
    let modEnd = searchURL.searchParams.get("dateModEnd");
    let tags = searchURL.searchParams.get("tags");
    
    /*console.log("name", nameInput);
    console.log(authorInput);
    console.log(createStart);
    console.log(createEnd);
    console.log(modStart);
    console.log(modEnd);*/
    fetch(`http://localhost:3000/api/search?name=${nameInput}&author=${authorInput}&dateCrSt=${createStart}&dateCrEnd=${createEnd}&dateModSt=${modStart}&dateModEnd=${modEnd}&tags=${tags}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        if (response.status >= 300) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } else{
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

                tr.setAttribute("id", response.projects[i].id);
                tr.setAttribute("class", "themed-grid-col col-sm-8");

                let tdFile = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");
                let tdDepth = document.createElement("td");

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

                if(response.projects[i].isAuthor){
                    let button = document.createElement("input");
                    button.type = "button";
                    button.addEventListener("click", () => showversions(response.projects[i].file));
                    button.value = "Редактировать";
                    button.title = "Просмотр версий проекта или создание первой версии";
                    button.setAttribute("class", "button-table");

                    let delbutton = document.createElement("input");
                    delbutton.type = "button";
                    delbutton.addEventListener("click", () => deleteProject(response.projects[i].file))
                    delbutton.value = "Удалить";
                    delbutton.title = "Удаление проекта, включая все версии";
                    delbutton.setAttribute("class", "button-table");

                    let tdBut = document.createElement("td");
                    let tdDel = document.createElement("td");

                    tdBut.appendChild(button);
                    tdDel.appendChild(delbutton);
                    tr.appendChild(tdBut);
                    tr.appendChild(tdDel);
                    tr.setAttribute("name", "author");
                } else { 
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
                    watchbutton.addEventListener("click",  () => showversions(response.projects[i].file));
                    watchbutton.setAttribute("class", "button-table");
                    tdBut.appendChild(button);
                    tdWBut.appendChild(watchbutton);
                    tr.appendChild(tdBut);
                    tr.appendChild(tdWBut);
                    tr.setAttribute("name", "not author");
                }
                table.appendChild(tr);
            }
        });
     } })
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
            let len = response.versions.length;

            for (let i = 0; i < len; i++) {
                if (document.getElementById("ep" + response.versions[i].id)) {
                    continue
                }

                let parentElement = document.getElementById(response.versions[i].root);
                let tr = document.createElement("tr");
                tr.setAttribute("id", "ep" + response.versions[i].id);
                tr.setAttribute("class", "themed-grid-col col-sm-8");

                let tdEmpty = document.createElement("td");
                let tdVersion = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdDateM = document.createElement("td");
                let tdAuthor = document.createElement("td");

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
                
                let pName = document.getElementsByName("author");
                for(let k = 0; k < pName.length; k++){
                    let status = pName[k].getAttribute("id");
                    if(status == parentElement.getAttribute("id")){
                        let button = document.createElement("input");
                        button.type = "button";
                        button.addEventListener("click", () => document.location.href = `../versions?ver=${response.versions[i].id}`);
                        button.value = "Редактировать";
                        button.title = "Переход в окно редактирования версии проекта";
                        button.setAttribute("class", "button-table");
        
                        let tdButton = document.createElement("td");
                        tdButton.appendChild(button);
        
                        let delbutton = document.createElement("input");
                        delbutton.type = "button";
                        delbutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
                        delbutton.value = "Удалить";
                        delbutton.title = "Удаление версии проекта";
                        delbutton.setAttribute("class", "button-table");
                        
                        let tdDelbutton = document.createElement("td");
                        tdDelbutton.appendChild(delbutton);

                        tr.appendChild(tdButton);
                        tr.appendChild(tdDelbutton);
                    }
                }
                
                let pNotName = document.getElementsByName("not author");
                for(let k = 0; k < pNotName.length; k++){
                    let status = pNotName[k].getAttribute("id");
                    if(status == parentElement.getAttribute("id")){
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
                        tdBut.appendChild(button);
                        tdCBut.appendChild(clonebutton);
                        tr.appendChild(tdCBut);
                        tr.appendChild(tdBut);
                    }
                }
                parentElement.after(tr);
                    
            }
            if (!document.getElementById("nametr")) {
                let tdEmpty = document.createElement("td");
                let tdName = document.createElement("td");
                let tdDC = document.createElement("td");
                let tdDM = document.createElement("td");
                let tdA = document.createElement("td");
                let trp = document.createElement("tr");
                trp.setAttribute("id", "nametr")
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


showprojects();