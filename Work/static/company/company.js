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
                let watchbutton = document.createElement("input");
                let tdWBut = document.createElement("td");
                watchbutton.type = "button";
                watchbutton.value = "Версии";
                watchbutton.addEventListener("click",  () => showversions(response.projects[i].file));
                
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
            for (let i = 0; i < response.versions.length; i++) {
                if (document.getElementById("ep" + response.versions[i].id)) {
                    continue
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

                let clonebutton = document.createElement("input");
                let tdCBut = document.createElement("td");
                clonebutton.type = "button";
                //delbutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
                clonebutton.value = "Клонировать";

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
                tr.appendChild(tdBut);
                tr.appendChild(tdCBut);

                parentElement.after(tr);
            }
            let tdEmpty = document.createElement("td");
            let tdName = document.createElement("td");
            let tdDC = document.createElement("td");
            let tdDM = document.createElement("td");
            let tdA = document.createElement("td");
            let tr = document.createElement("tr");
            tdName.innerText = "Название";
            tdDC.innerText = "Дата создания";
            tdDM.innerText = "Дата изменения";
            tdA.innerText = "Автор";
            tr.appendChild(tdEmpty);
            tr.appendChild(tdName);
            tr.appendChild(tdDC);
            tr.appendChild(tdDM);
            tr.appendChild(tdA);
            let parentElement = document.getElementById(response.versions[0].root);
            parentElement.after(tr);
        });

    })
}


showallprojects();