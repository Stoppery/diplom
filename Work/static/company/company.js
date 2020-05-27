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

                table.appendChild(tr);
            }
        });
    })
}

showallprojects();