
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

let currentURL = ""; 

var signup_button = document.getElementById("signup-btn").addEventListener("click", function () {
    window.location.href = currentURL + "/inscrie-te.html";
});

var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
    window.location.href = currentURL + "/aboutus.html";
});

var resetpass_button = document.getElementById("forgot-pass").addEventListener("click", function () {
  window.location.href = currentURL + "/forgot_password";
});

// Ok so this is kind of wierd but this is how i managed user auth tracking. basically if user than redirect to another page.
// there is probably a better way, but it works for now.
// If u wanna look for a better way of handling this go to https://youtube.com/playlist?list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ
// or just look it up on google. but for now i'll leave it like that

const setupUI = (user) => {
  if(user) {
    
    window.location.href = currentURL + "/myaccount.html";
  } else {
    
  }
}

onAuthStateChanged(auth, (user) => {
  setupUI(user);
});


var submit_button = document.getElementById("submit-btn").addEventListener("click", function ()  {
  startLoading();
  // Get all our input fields
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var announce = document.getElementById("announce");
  
  // wierd i know :)
  var email_element = document.getElementById("email");
  var password_element = document.getElementById("password");

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
      stopLoadingAndShowError("Nu ați introdus date corecte.") ;
      return;
      // Don't continue running the code
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser;

    // Add this user to Firebase Database
    var database_ref = ref(database);

    // Create User data
    var user_data = {
    last_login : Date.now()
    }

    // Push to Firebase Database
    update(ref(database, 'users/' + user.uid), user_data);

    // Done
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    
    if(error_code == "auth/wrong-password")
    {
      stopLoadingAndShowError("Parola este greșită.");
      password_element.value = "";
    } else 
    if(error_code == "auth/too-many-requests")
    {
      stopLoadingAndShowError("Ați încercat de prea multe ori sa va logați in acest cont. Vă rugăm încercați mai tarziu.");
      password_element.value = "";
    } else 
    if(error_code == "auth/user-not-found")
    {
      stopLoadingAndShowError("Datele de conectare sunt incorecte.");
      email_element.value = "";
      password_element.value = "";
    } else {
      stopLoadingAndShowError(error_message);
      email_element.value = "";
      password_element.value = "";
    }
  })
  
});


function startLoading() {
  document.getElementById("signup").style.display = "none";
  document.getElementById("loader").style.display = 'inline';
  // document.getElementById("loader").style.visibility = 'visible';
  // document.getElementById("card").style.height = "44rem";
}

function stopLoadingAndShowError(err) {
  document.getElementById("error").style.display = "grid";
  document.getElementById("error").style.visibility = "visible";

  document.getElementById("announce").innerHTML = err;
  // document.getElementById('error').scrollIntoView();
  document.getElementById("loader").style.display= 'none';

  setTimeout(hideError, 3400);
}

function hideError() {
  document.getElementById('error').style.display = "none";
}

// Validate Functions
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

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}



