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
                button.value = "Клонировать";
                let watchbutton = document.createElement("input");
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

                tr.appendChild(tdFile);
                tr.appendChild(tdDate);
                tr.appendChild(tdDateM)
                tr.appendChild(tdAuthor);
                tr.appendChild(tdDepth);
                tr.appendChild(button);
                tr.appendChild(watchbutton);

                table.appendChild(tr);
            }
        });
    })
}


function showversions(ver) {
    fetch(`http://localhost:3000/api/company/version?ver=${ver}`, {
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
                //button.addEventListener("click", () => document.location.href = `../versions?ver=${response.versions[i].id}`);
                button.value = "Просмотр";

                let clonebutton = document.createElement("input");
                clonebutton.type = "button";
                //delbutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
                clonebutton.value = "Клонировать";

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
                tr.appendChild(button);
                tr.appendChild(clonebutton);

                parentElement.after(tr);
            }
        });

    })
}


showallprojects();