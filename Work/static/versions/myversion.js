async function showVersion(){
    console.log(document.location.search);
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
            savebutton.type = "button";
            //savebutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
            savebutton.value = "Сохранить";
            let saveasbutton = document.createElement("input");
            saveasbutton.type = "button";
            //savebutton.addEventListener("click", () => deleteVersion(response.versions[i].id));
            saveasbutton.value = "Сохранить как";

            tdVersion.innerText = response.versions[0].version;
            let tempdatecreate = new Date(response.versions[0].datecreate).toLocaleString("ru");
            tdDate.innerText = tempdatecreate;
            let tempdatemodified = new Date(response.versions[0].datemodified).toLocaleString("ru");
            tdDateM.innerText = tempdatemodified;

            tr.appendChild(tdVersion);
            tr.appendChild(tdDate);
            tr.appendChild(tdDateM);
            tr.appendChild(savebutton);
            tr.appendChild(saveasbutton);
            table.appendChild(tr);
        })
    })
}


showVersion();