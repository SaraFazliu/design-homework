// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD8al2W2LFomiCSCV57kXJs1R3Bt5KVmHw",
    authDomain: "design-architecture-homework.firebaseapp.com",
    projectId: "design-architecture-homework",
    storageBucket: "design-architecture-homework.appspot.com",
    messagingSenderId: "338390459397",
    appId: "1:338390459397:web:2b0ad671239d0a5c4be86c",
    measurementId: "G-Q07CP4QKX7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


function lang(){
    return localStorage.getItem('lang') || 'en';
}
function setLang(lang) {
    localStorage.setItem('lang', lang);
    localization();
}

function register() {
    let email = document.getElementById('emailField').value;
    let password = document.getElementById('passwordField').value;
    let passwordRepeat = document.getElementById('repeatPasswordField').value;
      if(email === '' || password === '' || passwordRepeat === ''){
        alert(language = 'en' ? 'All fields are required!' : "Сите полиња се задолжителни");
       //return;
    
    if(password !== passwordRepeat){ 
        alert(language == 'en' ? 'Passwords not match' : 'Лозинките не се совпаѓаат');
        return ;
    }
   
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            if(user){
                localStorage.setItem('user', user.user.email)
                localStorage.setItem('userId', user.user.uid)
                location.href = 'where.html';

            }
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}
function logout(){
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    location.href='index.html'
}
function login() {
    let button = document.getElementById('loginButton');

    let email = document.getElementById('emailField').value;
    let password = document.getElementById('passwordField').value;

    if(email === '' || password === '' ){
        alert(language = 'en' ? 'All fields are required!' : "Сите полиња се задолжителни");
        return;
    }
    button.innerText = button.innerText+" - loading";
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            if(user){
                localStorage.setItem('user', user.user.email)
                localStorage.setItem('userId', user.user.uid)
                location.href = 'where.html';
            }
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        }).finally(()=>{
            button.innerText = button.innerText.replace('- loading', '')
    })
}
function redirect() {
    let l = location.pathname;
// redirect to users-only or guests only
    console.log(l);
    if (l[l.length-1] === '/' || l.indexOf('index') !== -1 || l.indexOf('register') !== -1) {
        if (localStorage.getItem('user')) {
            location.href = 'where.html';
        }
    } else {
        if (!localStorage.getItem('user')) {
            location.href = 'index.html';
        }
    }
}
redirect();
