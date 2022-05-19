import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";


const signupURL = "/inscrie-te";
const aboutusURL = "/aboutus";
const forgotPassURL = "/fogot_pass";
const myAccountURL = "/myaccount";
const indexURL = "/";
const loginURL = "/login";

// const signupURL = "/inscrie-te.html";
// const aboutusURL = "/aboutus.html";
// const forgotPassURL = "/fogot_pass.html";
// const myAccountURL = "/myaccount.html";
// const indexURL = "/index.html";
// const loginURL = "/login.html";

let isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}

// initial card width setup
function cardWidthSetup() {
  if(isMobile) {
    if(window.orientation == 0) {
      document.querySelector("#card").style.width = "96%";
    } else {
      document.querySelector("#card").style.width = "55%";
    }
  }
}

cardWidthSetup();

window.addEventListener("orientationchange", function() {
  // Announce the new orientation number
  cardWidthSetup();

}, false);

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

let currentURL = ""; 

const aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href = aboutusURL;
});

const back_button = document.getElementById("back-btn").addEventListener("click", function () {
  window.location.href = loginURL;
});


const reset_button = document.getElementById("reset-btn").addEventListener("click", function () {
    var email = document.getElementById('email').value;
    var announce = document.getElementById("announce");
    
    if (validate_email(email)==false) {
        announce.innerHTML = 'Emailul introdus este greșit.';
        return;
    }

    sendPasswordResetEmail(auth, email).then(() => {
       announce.innerHTML = "Un email pentru resetarea parolei a fost trimis la adresa introdusă.";
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
    window.location.href = myAccountURL;
  } else {
  }
}

onAuthStateChanged(auth, (user) => {
  setupUI(user);
});

