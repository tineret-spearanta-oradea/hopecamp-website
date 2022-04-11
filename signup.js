import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDownloadURL, uploadBytes, getStorage, ref as storage_ref } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
const storage = getStorage();

const dbRef = ref(database);
const pfpRef = storage_ref(storage, "profilepics");


var currentURL = window.location.href;
var currentURL = "http://127.0.0.1:5500";
var currentURL = "";


document.getElementById("profile-photo").addEventListener("change", function(e) {
  var file = e.target.files[0];
  var fileName = document.getElementById('user-email').value;
  
  const metadata = {
    contentType: 'image/jpeg',
  };

  uploadBytes(storage_ref(pfpRef, fileName), file, metadata);
});


var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href =  currentURL + "/aboutus.html";
});

var signup_button = document.getElementById("signup-btn").addEventListener("click", function ()  {
  // Get all our input fields
  var email = document.getElementById("user-email").value;
  var password = document.getElementById("user-password").value;
  var confirm_password = document.getElementById("user-confirm-password").value;
  var announce = document.getElementById("announce");
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false || password != confirm_password) {
    announce.innerHTML = 'Emailul sau parola sunt incorecte. Emailul trebuie sa aiba un format valid nume@exemplu.com iar parola trebuie sa aiba minim 6 caractere.';
    return
    // Don't continue running the code
  }

  // Move on with Auth
  createUserWithEmailAndPassword(auth, email, password)
  .then(function() {
    
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;

    announce.innerHTML = error_message;
  })

});


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

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}


const setupUI = (user) => {
  if(user) {
    
    window.location.href= currentURL + "/myaccount.html";
  } else {
    
  }
}


function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

const pushToDatabaseAndSetupUI = (user) => {

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


  
  getDownloadURL(storage_ref(pfpRef, email)).then((url) => {
    pfpURL = url;
    var unique_ID = 100;
    get(child(dbRef, `users/`)).then((snapshot) => {
      if (snapshot.exists()) {
        var numberOfExistingUsers = countProperties(snapshot.val())
        unique_ID += numberOfExistingUsers;
      } else {
        // alert("No data available");
      }

      var user_data = {
        email : email,
        qr_id: unique_ID,
        // password: password,
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
        console.log(error.message);
        alert(error.message);
      });


    }).catch((error) => {
      console.log(error);
    });

   
  })

  
}

onAuthStateChanged(auth, (user) => {
  if(user) {
    pushToDatabaseAndSetupUI(user); // here it goes the setupUI
  }
})
