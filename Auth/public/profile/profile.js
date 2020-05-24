function getProfile() {
    let nameInput = document.getElementById("name");
    let surnameInput = document.getElementById("surname");
    let phoneInput = document.getElementById("phone");
    let emailInput = document.getElementById("email");
    let statusInput = document.getElementById("status");

    fetch('http://localhost:3000/api/profile', {
        method: 'GET',
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
        } else {
            response.json().then(response => {
                nameInput.value = response.name;
                surnameInput.value = response.surname;
                phoneInput.value = response.phone;
                emailInput.value = response.email;
                statusInput.value = String(response.status);
            });
        }
    })
}

function changePassword() {
    let password = prompt('Please enter new password', "");

    let user = {
        password: password
    };

    fetch('http://localhost:3000/api/user/password', {
        method: 'POST',
        body: JSON.stringify(user),
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
        } else {
            response.json().then(response => {
                nameInput.value = response.name;
                surnameInput.value = response.surname;
                phoneInput.value = response.phone;
                emailInput.value = response.email;
                statusInput.value = String(response.status);
            });
        }
    })

}

getProfile();