async function showVersion(){
    let searchURL = new URL(document.location.href);
    let version = searchURL.searchParams.get("ver");
    //let version = document.location.search.substring(document.location.search.indexOf('=') + 1);
    console.log(version);
   fetch(`http://localhost:3000/api/company/version?ver=${version}`, {
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

          /*  let savebutton = document.createElement("input");
            let tdSaveBut = document.createElement("td");
            savebutton.type = "button";
            savebutton.title = "Сохранение версии проекта";
            savebutton.addEventListener("click", () => saveVersion(version));
            savebutton.value = "Сохранить";

           let saveasbutton = document.createElement("input");
            let tdSaveAsBut = document.createElement("td");
            saveasbutton.type = "button";
            saveasbutton.addEventListener("click", () => document.location.href = `../versions/create?ver=${version}`);
            saveasbutton.value = "Создать новую версию";
            saveasbutton.title = "Создание новой версии на базе текущей";

           let createbutton = document.createElement("input");
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

            //tdSaveBut.appendChild(savebutton);
            //tdSaveAsBut.appendChild(saveasbutton);
           // tdCrBut.appendChild(createbutton);
            tr.appendChild(tdVersion);
            tr.appendChild(tdDate);
            tr.appendChild(tdDateM);
            //tr.appendChild(tdSaveBut);
            //tr.appendChild(tdSaveAsBut);
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

showVersion();