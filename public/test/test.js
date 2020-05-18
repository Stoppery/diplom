let response = fetch('http://localhost:3000/api/test', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
})
    .then(response => response.json())
    .then(result => {
        console.log(result);

        let block = document.getElementById("testInput");
        block.innerText = result.ber4un;
    });