import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

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
    window.location.href = currentURL + "/myaccount";
  } else {
  }
}

onAuthStateChanged(auth, (user) => {
  setupUI(user);
});

