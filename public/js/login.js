function test() {
    let test = document.getElementById("email");
    console.log(test.value.substr(test.value.indexOf("@")+1, test.value.lastIndexOf(".") - test.value.indexOf("@")-1))
}