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
const loginURL = "/login.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();

const dbRef = ref(database);
const pfpRef = storage_ref(storage, "profilepics");

let isMobile = false;

// checking if user is accessing from mobile
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


const aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href =  aboutusURL;
});
const login_button = document.getElementById("login").addEventListener("click", function () {
  window.location.href =  loginURL;
});

const agree_checked = document.getElementById("agree").addEventListener("change", function() {
  if (this.checked) {
    const UIsignupBtn = document.getElementById('signup-btn');
    UIsignupBtn.disable = false;
    UIsignupBtn.style.setProperty("--c1", "#ff9000");
    UIsignupBtn.style.setProperty("--c2", "#ffbb19");
    UIsignupBtn.style.setProperty("--c3", "#463015");

    // UIsignupBtn.style.animation = "graytocolor 5s infinite"; //NOT working
  } else {
    const UIsignupBtn = document.getElementById('signup-btn');
    UIsignupBtn.disable = true;
    UIsignupBtn.style.setProperty("--c1", "#5a5a5a");
    UIsignupBtn.style.setProperty("--c2", "#bdbdbd");
    UIsignupBtn.style.setProperty("--c3", "#fff");

  }
});

// Make enter button equivalent with Submit button
const UIEmailAndPass = document.querySelectorAll(".form-content");
for(let i=0; i<UIEmailAndPass.length; i++)
{
  UIEmailAndPass[i].addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector("#continue-btn").click();
    }
  });
}
// const test_button = document.getElementById("test-btn").addEventListener("click", function ()  { 
// });

const continue_button = document.getElementById("continue-btn").addEventListener("click", function ()  {
  
  // UI setup (loading)
  startLoading(0);

  // Get all our input fields

  let email = document.getElementById("user-email").value;
  let password = document.getElementById("user-password").value;
  let confirm_password = document.getElementById("user-confirm-password").value;
  let age = document.getElementById("age").value;
  let announce = document.getElementById("announce");
  let church = document.querySelector('input[name="church_choice"]:checked');
  if(church && church.value==="Alta"){
    church = document.getElementById("other-church").value;
  } else if(church){
    church = church.value;
  } 
  let pay = document.querySelector('input[name="pay_choice"]:checked');    
  let transport = document.querySelector('input[name="transport_choice"]:checked');     
  const pfp = document.getElementById("profile-photo").files[0];
  
  let fields = [
    document.getElementById("name"),
    document.getElementById("age"),
    document.getElementById("phone"),
    document.getElementById("contribui"),
  ];

  let somethingIsNotValid;
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    stopLoadingAndShowError(0, 'Emailul sau parola sunt incorecte. Emailul trebuie sa contina "@" iar parola trebuie sa aibă minim 6 caractere.');
    somethingIsNotValid = true;
  }

  if (password != confirm_password) {
    stopLoadingAndShowError(0, "Parola nu corespunde cu confirmarea parolei.");
    somethingIsNotValid = true;
  }

  fields.forEach(field => {
    if(validate_field(field.value) === false && !somethingIsNotValid) {
      stopLoadingAndShowError(0, 'Trebuie completate toate câmpurile obligatorii');
      somethingIsNotValid = true;
    }
  });

  if(!church && !somethingIsNotValid) {
    stopLoadingAndShowError(0, "Alege biserica din care faci parte.");
    somethingIsNotValid = true;
  }

  if(!pay && !somethingIsNotValid) {
    stopLoadingAndShowError(0, "Alege cui plătești.");
    somethingIsNotValid = true;
  }

  if(!transport && !somethingIsNotValid){
    stopLoadingAndShowError(0, "Alege modalitatea de transport.");
    somethingIsNotValid = true;
  }
  
  if(typeof pfp === "undefined" && !somethingIsNotValid)
  {
    stopLoadingAndShowError(0, "Introdu o poză cu tine.");
    somethingIsNotValid = true;
  }

  // if(!(document.getElementById("agree").checked) && !somethingIsNotValid)
  // {
  //   stopLoadingAndShowError(0, "Trebuie sa fii de-acord cu regulamentul (apasa pe patratel)");
  //   somethingIsNotValid = true;
  // }

  // if(age<18){
  //   alert("Semnez faptul ca parintii mei au citit regulamentul si sunt de-acord cu acesta");
  // }

  // Move on with auth if every input is valid
  if(!somethingIsNotValid){
    document.getElementById("changeable-content-0").style.display = "none";
    document.getElementById("changeable-content-1").style.display = "block";
    
    if(age<18) {
      document.getElementById("under18-agree").style.display = "block";
    }
  }
});

const signup_button = document.getElementById("signup-btn").addEventListener("click", function ()  { 
  let email = document.getElementById("user-email").value;
  let password = document.getElementById("user-password").value;
  startLoading(1);

  createUserWithEmailAndPassword(auth, email, password)
    .then(function() {
      
    })
    .catch(function(error) {

      if(error.code === "auth/invalid-email"){
        stopLoadingAndShowError(1, "Email invalid.");
      } else if(error.code === "auth/invalid-password"){
        stopLoadingAndShowError(1, "Parola invalidă.");
      } else {
        stopLoadingAndShowError(1, error.message);
      }
    })
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
  let church = document.querySelector('input[name="church_choice"]:checked').value;
  if(church==="Alta"){
    church = document.getElementById("other-church").value;
  }
  let pay = document.querySelector('input[name="pay_choice"]:checked').value;   
  let transport = document.querySelector('input[name="transport_choice"]:checked').value;   
  var start_date = document.getElementById("start-date").value;
  var end_date = document.getElementById("end-date").value;
  const contribui_options = [ 
    document.getElementById("contribui1"),
    document.getElementById("contribui2"),
    document.getElementById("contribui3"),
    document.getElementById("contribui4"),
  ];
  let finalContribuiOptions = "";
  contribui_options.forEach(option => {
    if(option.checked) { 
      finalOptions += `${option.value} / `;
    }
  });

  var person = document.getElementById("person").value;
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
          contribui: finalContribuiOptions,
          cazare_cu: person,
          transport: transport,
          prezent: 0,
          img_url: pfpURL,
        };

        set(ref(database, 'users/' + user.uid), user_data)
        .then(function() {
          setupUI(user);
        })
        .catch(function(error) {
          stopLoadingAndShowError(0, error.message);
        });


      }).catch((error) => {
        stopLoadingAndShowError(0, error.message);
      });

    
    }).catch((error) => {
      stopLoadingAndShowError(0, error.message);
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

function startLoading(changeable) {
  if(changeable===0){
    document.getElementById("error").style.visibility = "hidden";
    document.getElementById("loader").style.visibility = 'visible';
  } else if(changeable===1) {
    document.getElementById("error-1").style.visibility = "hidden";
    document.getElementById("loader-1").style.visibility = 'visible';
  }
  // document.getElementById("card").style.height = "108rem";
}

function stopLoadingAndShowError(changeable, err) {
  // console.log(err);
  if(changeable===0) {
    document.getElementById("error").style.display = "inline";
    document.getElementById("error").style.visibility = "visible";
    document.getElementById("announce").innerHTML = err;
    document.getElementById('error').scrollIntoView();
    document.getElementById("loader").style.visibility = 'hidden';
    document.getElementById("last-small-info").style.visibility = "hidden";

    setTimeout(hideError0, 3400);
  } else if(changeable===1) {
    document.getElementById("error-1").style.display = "block";
    document.getElementById("error-1").style.visibility = "visible";
    document.getElementById("announce-1").innerHTML = err;
    document.getElementById('error-1').scrollIntoView();
    document.getElementById("loader-1").style.display = 'block';
    document.getElementById("loader-1").style.visibility = 'hidden';

    setTimeout(hideError1, 3400);
  }
}

function hideError0() {
  document.getElementById('error').style.display = "none";
}
function hideError1() {
  document.getElementById('error-1').style.display = "none";
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

