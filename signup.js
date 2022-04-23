import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDownloadURL, uploadBytes, getStorage, ref as storage_ref } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { firebaseConfig } from "./fb_cfg.js";


const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const forgotPassURL = "/fogot_pass.html";
const myAccountURL = "/myaccount.html";
const indexURL = "/index.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();

const dbRef = ref(database);
const pfpRef = storage_ref(storage, "profilepics");

let currentURL = ""; 



var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href =  aboutusURL;
});

const agree_checked = document.getElementById("agree").addEventListener("change", function() {
  if (this.checked) {
    const UIsignupBtn = document.getElementById('signup-btn');
    UIsignupBtn.disable = false;
    UIsignupBtn.style.backgroundImage = "-webkit-linear-gradient(right, #106fcf, #c272a0)";
    UIsignupBtn.style.animation = "graytocolor 5s infinite"; //NOT working
  } else {
    const UIsignupBtn = document.getElementById('signup-btn');
    UIsignupBtn.disable = true;
    UIsignupBtn.style.backgroundImage = "-webkit-linear-gradient(left, #5a5a5a, #bdbdbd)";
  }
});

var signup_button = document.getElementById("signup-btn").addEventListener("click", function ()  {
  
  // UI setup (loading)
  startLoading();

  // Get all our input fields
  let email = document.getElementById("user-email").value;
  let password = document.getElementById("user-password").value;
  let confirm_password = document.getElementById("user-confirm-password").value;
  let announce = document.getElementById("announce");

  const pfp = document.getElementById("profile-photo").files[0];
  
  let fields = [
    document.getElementById("name"),
    document.getElementById("age"),
    document.getElementById("phone"),
    document.getElementById("church"),
    document.getElementById("pay"),
    document.getElementById("contribui"),
  ];

  let somethingIsNotValid;
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    stopLoadingAndShowError('Emailul sau parola sunt incorecte. Emailul trebuie sa contina "@" iar parola trebuie sa aibă minim 6 caractere.');
    somethingIsNotValid = true;
  }

  if (password != confirm_password) {
    stopLoadingAndShowError("Parola nu corespunde cu confirmarea parolei.");
    somethingIsNotValid = true;
  }

  fields.forEach(field => {
    if(validate_field(field.value) === false && !somethingIsNotValid) {
      stopLoadingAndShowError('Trebuie completate toate câmpurile obligatorii');
      somethingIsNotValid = true;
    }
  });

  if(typeof pfp === "undefined" && !somethingIsNotValid)
  {
    stopLoadingAndShowError("Introdu o poză cu tine.");
    somethingIsNotValid = true;
  }

  if(!(document.getElementById("agree").checked) && !somethingIsNotValid)
  {
    stopLoadingAndShowError("Trebuie sa fii de-acord cu regulamentul (apasa pe patratel)");
    somethingIsNotValid = true;
  }
  // Move on with auth if every input is valid
  if(!somethingIsNotValid){
    createUserWithEmailAndPassword(auth, email, password)
    .then(function() {
      
    })
    .catch(function(error) {

      if(error.code === "auth/invalid-email"){
        stopLoadingAndShowError("Email invalid.");
      } else if(error.code === "auth/invalid-password"){
        stopLoadingAndShowError("Parola invalidă.");
      } else {
        stopLoadingAndShowError(error.message);
      }
    })
  }
});

onAuthStateChanged(auth, (user) => {
  if(user) {
    console.log("logged in");
    pushToDatabaseAndSetupUI(user); // here it goes the setupUI
  } else {
    console.log("NOT logged in.");
  }
});

const pushToDatabaseAndSetupUI = (user) => {

  let announce = document.getElementById("announce");

  var email = document.getElementById("user-email").value;
  var password = document.getElementById("user-password").value;
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var phone = document.getElementById("phone").value;
  var church = document.getElementById("church").value;
  var pay = document.getElementById("pay").value;
  var start_date = document.getElementById("start-date").value;
  var end_date = document.getElementById("end-date").value;
  var contribui = document.getElementById("contribui").value;
  var person = document.getElementById("person").value;
  var other = document.getElementById("other").value;
  var pfpURL;

  var file = document.getElementById("profile-photo").files[0];
  
  const metadata = { contentType: 'image/jpeg' };

  // upload image to firestore
  uploadBytes(storage_ref(pfpRef, user.uid), file, metadata).then(function()  {
    // get link for the image

    getDownloadURL(storage_ref(pfpRef, user.uid)).then((url) => {
      pfpURL = url;
      var unique_ID = 300;
      get(child(dbRef, `users/`)).then((snapshot) => {
        if (snapshot.exists()) {
          var numberOfExistingUsers = countProperties(snapshot.val());
          unique_ID += numberOfExistingUsers;
        } else {
          // alert("No data available");
        }

        var user_data = {
          email : email,
          qr_id: unique_ID,
          // password: password,
          admin: false,
          name: name,
          age: age,
          phone: phone,
          church: church,
          cui_platesc: pay,
          payed: 0,
          start_date: start_date,
          end_date: end_date,
          contribui: contribui,
          cazare_cu: person,
          observatii_sugestii: other,
          img_url: pfpURL,
        };

        set(ref(database, 'users/' + user.uid), user_data)
        .then(function() {
          setupUI(user);
        })
        .catch(function(error) {
          stopLoadingAndShowError(error.message);
        });


      }).catch((error) => {
        stopLoadingAndShowError(error.message);
      });

    
    }).catch((error) => {
      stopLoadingAndShowError(error.message);
    });
  });
  
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
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}


const setupUI = (user) => {
  if(user) {
    window.location.href= myAccountURL;
  } else {
    
  }
}

function startLoading() {
  document.getElementById("error").style.visibility = "hidden";
  document.getElementById("loader").style.visibility = 'visible';
  // document.getElementById("card").style.height = "108rem";
}

function stopLoadingAndShowError(err) {
  // console.log(err);
  document.getElementById("error").style.display = "inline";
  document.getElementById("error").style.visibility = "visible";
  document.getElementById("announce").innerHTML = err;
  // document.getElementById('error').scrollIntoView();
  document.getElementById("loader").style.visibility = 'hidden';
  document.getElementById("last-small-info").style.visibility = "hidden";

  setTimeout(hideError, 3400);
}

function hideError() {
  document.getElementById('error').style.display = "none";
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

