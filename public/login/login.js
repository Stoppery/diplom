function login(event) {
    console.log("FRONT LOGIN");
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
    //     .then(result => {
    //         console.log(result);
    //
    //         let block = document.getElementById("testInput");
    //         block.innerText = result.ber4un;
    //     });
    //
    //
    // let test = document.getElementById("email");
    //
    //
    //
    // console.log(test.value.substr(test.value.indexOf("@")+1, test.value.lastIndexOf(".") - test.value.indexOf("@")-1))
}