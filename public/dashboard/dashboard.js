function createUser() {
    let nameInput = document.getElementById("name");
    let surnameInput = document.getElementById("surname");
    let phoneInput = document.getElementById("phone");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let statusInput = document.getElementById("status");

    let user = {
        name: nameInput.value,
        surname: surnameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        status: statusInput.value,
    };

    fetch('http://localhost:3000/api/user', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    }).then(response => {
        if (response.status >= 300) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } else {
            nameInput.value = "";
            surnameInput.value = "";
            phoneInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            statusInput.value = "";
        }
    })
}
