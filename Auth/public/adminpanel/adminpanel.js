function deleteUser(email) {
    console.log(`email = ${email}`);
    fetch(`http://localhost:3000/api/user?email=${email}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    });
    document.getElementById("userTable").remove();
    let table = document.createElement("table");
    table.id = "userTable";
    document.getElementById("panel").appendChild(table);
    getUsers();
}

async function getUsers() {
    let status;
    await fetch('http://localhost:3000/api/admin/check', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    }).then(response => {
        console.log("1");
        if (response.status !== 200) {
            status = false;
            return
        }
        status = true;
    });
    
    console.log("2");
    fetch('http://localhost:3000/api/showUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    }).then(response => {
        response.json().then(response => {
            let table = document.getElementById("userTable");

            for (let i = 0; i < response.users.length; i++) {
                let tr = document.createElement("tr");
                let tdName = document.createElement("td");
                let tdSurname = document.createElement("td");
                let tdPhone = document.createElement("td");
                let tdEmail = document.createElement("td");
                let tdStatus = document.createElement("td");

                tdName.innerText = response.users[i].name;
                tdSurname.innerText = response.users[i].surname;
                tdPhone.innerText = response.users[i].phone;
                tdEmail.innerText = response.users[i].email;
                tdStatus.innerText = response.users[i].status;

                tr.appendChild(tdName);
                tr.appendChild(tdSurname);
                tr.appendChild(tdPhone);
                tr.appendChild(tdEmail);
                tr.appendChild(tdStatus);
        
                if (status) {
                    let button = document.createElement("input");
                    button.type = "button";
                    button.addEventListener("click", () => deleteUser(response.users[i].email));
                    button.value = "Удалить";
                    tr.appendChild(button);
                }
                table.appendChild(tr);
            }
        });
        // if (response.status !== 200) {
        //     response.json().then(response => {
        //         let error = document.getElementById("error");
        //         error.innerText = response.error;
        //     });
        // } else {
        // response.json().then(response => {
        //     nameInput.value = response.name;
        //     surnameInput.value = response.surname;
        //     phoneInput.value = response.phone;
        //     emailInput.value = response.email;
        //     statusInput.value = String(response.status);
        // });
        // }
    })
}

getUsers();