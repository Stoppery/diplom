async function showversions(file){
    fetch('http://localhost:3000/api/version?file=${file}', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8',
        },
    }).then(response => {
        response.json().then(response => {
            let table = document.getElementById("versionsTable");

            for (let i = 0; i < response.versions.length; i++) {
                let tr = document.createElement("tr");
                let tdVersion = document.createElement("td");
                let tdDate = document.createElement("td");
                let tdAuthor = document.createElement("td");

                let button = document.createElement("input");
                button.type = "button";
                //button.addEventListener("click", () => revertProject(response.users[i].email));
                button.value = "Редактировать";
                let delbutton = document.createElement("input");
                delbutton.type = "button";
                delbutton.addEventListener("click", () => deleteVersion(response.versions[i].version))
                delbutton.value = "Удалить";

                tdVersion.innerText = response.versions[i].version;
                let tempdatecreate = new Date(response.versions[i].datecreate).toDateString();
                tdDate.innerText = tempdatecreate;
                tdAuthor.innerText = response.versions[i].author;

                tr.appendChild(tdVersion);
                tr.appendChild(tdDate);
                tr.appendChild(tdAuthor);
                tr.appendChild(button);
                tr.appendChild(delbutton);

                table.appendChild(tr);
            }
        });
    })
}

function showForm(){
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

