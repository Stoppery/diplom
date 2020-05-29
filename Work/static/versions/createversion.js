function createVersion() {
    let nameInput = document.getElementById("name");
    let rootid = document.location.search.substring(document.location.search.indexOf('=') + 1);
    let version = {
        name: nameInput.value,
        rootver: rootid,
    };

    fetch('http://localhost:3000/api/versions/create', {
        method: 'POST',
        body: JSON.stringify(version),
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
            response.json().then(response => {
                let idVer = response.idV;
                window.location.href = `/versions?ver=${idVer}`;
            });
            
        }
    });

}