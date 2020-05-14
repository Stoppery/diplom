let requestURL = 'http://localhost:8080/profile';

const xhr = new XMLHttpRequest();
xhr.open(  'Get' , requestURL )
xhr.responseType = 'json';
xhr.onload = () => {
    
    alert(xhr.response);
}
xhr.send();