function login(event) {
    event.preventDefault();
    let passwordInput = document.getElementById("password");
    let emailInput = document.getElementById("email");

    let user = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            'Charset': 'utf-8'
        },
    }).then(response => {
        if (response.status !== 200) {
            response.json().then(response => {
                let error = document.getElementById("error");
                error.innerText = response.error;
            });
        } else {
            window.location.href = "/dashboard";
        }
    })
}