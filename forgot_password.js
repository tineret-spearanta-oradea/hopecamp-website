import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBoTIlt7j61N0p_HKz0Fqnr5l1ABOt-bcM",
    authDomain: "hopecamp-10d0f.firebaseapp.com",
    databaseURL: "https://hopecamp-10d0f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hopecamp-10d0f",
    storageBucket: "hopecamp-10d0f.appspot.com",
    messagingSenderId: "954127886824",
    appId: "1:954127886824:web:7f8cff00a8e663749a1c5d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

let currentURL = ""; 

var reset_button = document.getElementById("reset-btn").addEventListener("click", function () {
    var email = document.getElementById('email').value;
    var announce = document.getElementById("announce");
    
    if (validate_email(email)==false) {
        announce.innerHTML = 'Emailul introdus este gresit.';
        return;
    }

    sendPasswordResetEmail(auth, email).then(() => {
       announce.innerHTML = "Un email pentru resetarea parolei a fost trimis la adresa introdusa.";
    })
    .catch(error => {
        console.error(error);
    })
});

function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}


const setupUI = (user) => {
  if(user) {
    window.location.href = currentURL + "/myaccount.html";
  } else {
  }
}

onAuthStateChanged(auth, (user) => {
  setupUI(user);
});

