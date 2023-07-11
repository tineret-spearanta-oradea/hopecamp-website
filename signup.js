import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDownloadURL, uploadBytes, getStorage, ref as storage_ref } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { firebaseConfig } from "./fb_cfg.js";


const signupURL = "/inscrie-te";
const forgotPassURL = "/fogot_pass";
const myAccountURL = "/myaccount";
const indexURL = "/";
const loginURL = "/login";

// const signupURL = "/inscrie-te.html";
// const forgotPassURL = "/fogot_pass.html";
// const myAccountURL = "/myaccount.html";
// const indexURL = "/index.html";
// const loginURL = "/login.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();

const dbRef = ref(database);
const pfpRef = storage_ref(storage, "profilepics");

let isMobile = false;

// COMMENT THESE NEXT YEAR :) if we use this site*****************
// document.querySelector("#changeable-content-1").innerHTML = '';
// document.querySelector("#changeable-content-0").innerHTML =
// `
//  <div id="card-subtitle" style="height: 160px">
//   <p>
//     Ne pare rău.<br>
//     <strong>Locurile din tabără au fost ocupate!</strong><br>
//     Vestea bună e că ne poți vizita pe timp de zi
//     29 iulie - 3 august, Vila Speranța, Arieșeni.
//   </p>
//  </div>
// `;
//***************************************************************


// checking if user is accessing from mobile
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}

// initial card width setup
function cardWidthSetup() {
  if(isMobile) {
    if(window.orientation == 0) {
      document.querySelector("#card").style.width = "97%";
      document.querySelector("#card-content").style.padding = "12px 25px";
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

const select_days_w1 = document.querySelectorAll('#week1 div')
const select_days_w2 = document.querySelectorAll('#week2 div')

select_days_w1.forEach(day => {
  day.addEventListener("click", function (){
    var nextDate;

    select_days_w2.forEach(day => {
      if(day.classList.contains("selected-day")) {
        nextDate = day.dataset['date'];
      }
    });

    let date01, date02;
    date01 = new Date(day.dataset['date']);
    date02 = new Date(nextDate);

    if(date01 <= date02) {
      select_days_w1.forEach(day_grey => {
        day_grey.classList.remove("selected-day");
      });
        day.classList.add("selected-day");
    }
  })
});

select_days_w2.forEach(day => {
  day.addEventListener("click", function (){
    var previousDate;
    select_days_w1.forEach(day => {
      if(day.classList.contains("selected-day")) {
        previousDate = day.dataset['date'];
      }
    });

    let date01, date02;
    date01 = new Date(day.dataset['date']);
    date02 = new Date(previousDate);

    if(date01 >= date02) {
      select_days_w2.forEach(day_grey => {
        day_grey.classList.remove("selected-day");
      });
      day.classList.add("selected-day");
    }
  })
});

const aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href =  indexURL;
});
// const login_button = document.getElementById("login").addEventListener("click", function () {
//   window.location.href =  loginURL;
// });

const agree_checked = document.getElementById("agree").addEventListener("change", function() {
  let age = document.getElementById("age").value;
  if(age>=18) {
    if (this.checked) {
      const UIsignupBtn = document.getElementById('signup-btn');
      UIsignupBtn.disable = false;
      UIsignupBtn.style.setProperty("--c1", "#1ea3b0");
      UIsignupBtn.style.setProperty("--c2", "#9e5a00");
      UIsignupBtn.style.setProperty("--c3", "#463015");

      // UIsignupBtn.style.animation = "graytocolor 5s infinite"; //NOT working
    } else {
      const UIsignupBtn = document.getElementById('signup-btn');
      UIsignupBtn.disable = true;
      UIsignupBtn.style.setProperty("--c1", "#5a5a5a");
      UIsignupBtn.style.setProperty("--c2", "#bdbdbd");
      UIsignupBtn.style.setProperty("--c3", "#fff");

    }
  } else {
    if (this.checked) {
      const UIsignupBtn = document.getElementById('signup-btn');
      UIsignupBtn.disable = false;
      UIsignupBtn.style.setProperty("--c1", "#1ea3b0");
      UIsignupBtn.style.setProperty("--c2", "#9e5a00");
      UIsignupBtn.style.setProperty("--c3", "#463015");

      // UIsignupBtn.style.animation = "graytocolor 5s infinite"; //NOT working
    } else {
      const UIsignupBtn = document.getElementById('signup-btn');
      UIsignupBtn.disable = true;
      UIsignupBtn.style.setProperty("--c1", "#5a5a5a");
      UIsignupBtn.style.setProperty("--c2", "#bdbdbd");
      UIsignupBtn.style.setProperty("--c3", "#fff");

    }
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

const report_btn = document.querySelector("#report-btn").addEventListener("click", function() {
  if (confirm("Ceva nu functionează? Vei fi redirecționat către pagina lui Efraim Ghiurau de instagram, unde poti să îi scrii în privat ce nu functionează")) {
    window.open("https://www.instagram.com/efi.ghiurau/", '_blank').focus();
  } else {
    
  }
  
});

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
    ];

  let start_date, end_date;

  select_days_w1.forEach(day => {
    if(day.classList.contains("selected-day")) {
      start_date = day.dataset['date'];
    }
  });
  select_days_w2.forEach(day => {
    if(day.classList.contains("selected-day")) {
      end_date = day.dataset['date'];
    }
  });

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

    let date1 = new Date(start_date);
    let date2 = new Date(end_date);
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // if(diffDays===5) {
    //   document.querySelector("#taxa-inscriere-suma").innerHTML = `500 lei.`;
    // } else {
    //   document.querySelector("#taxa-inscriere-suma").innerHTML = `${(diffDays*120)} lei.`;
    // }

    
    if(age<18) {
      document.getElementById("regulament").style.display = "none";
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
    //  window.location.href = myAccountURL;
    console.log("logged in");

    console.log(user.metadata.creationTime);
    console.log(user.auth);
    var accountCreationTime = new Date(user.metadata.creationTime);

    var timeStamp = Math.round(new Date().getTime() / 1000);
    var timeStampSomeTimeAgo = timeStamp - (3600);
    var timeSomeTimeAgo= new Date(timeStampSomeTimeAgo*1000).getTime();

    if(accountCreationTime.getTime() > timeSomeTimeAgo ) {
      try {
        pushToDatabaseAndSetupUI(user); // here it goes the setupUI
      }
      catch (error) {
        console.error("Ceva nu a functionat cum trebuie. Daca eroarea insisnta, te rugam ia legatura cu noi prin datele de contact de pe prima pagina, https://www.hopecamp.ro/#contact ");
        window.location.href = myAccountURL;
      }
    } else {
      setupUI(user);
    }

  } else {
    console.log("NOT logged in.");
    //  window.location.href = myAccountURL;
  }
});

const pushToDatabaseAndSetupUI = (user) => {

  let announce = document.getElementById("announce");

  var email = document.getElementById("user-email").value;
  var password = document.getElementById("user-password").value;
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var phone = document.getElementById("phone").value;
  var church = document.querySelector('input[name="church_choice"]:checked').value;
  if(church==="Alta"){
    church = document.getElementById("other-church").value;
  }
  let pay = document.querySelector('input[name="pay_choice"]:checked').value;   
  let transport = document.querySelector('input[name="transport_choice"]:checked').value;  

  // let start_date = document.getElementById("start-date").value;
  // let end_date = document.getElementById("end-date").value;
  let start_date, end_date;

  select_days_w1.forEach(day => {
    if(day.classList.contains("selected-day")) {
      start_date = day.dataset['date'];
    }
  });
  select_days_w2.forEach(day => {
    if(day.classList.contains("selected-day")) {
      end_date = day.dataset['date'];
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
          unique_ID += numberOfExistingUsers + 10;
        } else {
          // alert("No data available");
        } 

        let now = new Date();
        let nowString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

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
          cazare_cu: person,
          transport: transport,
          prezent: 0,
          img_url: pfpURL,
          date_of_signup: nowString,
          is_confirmed: false,
          with_family: false,
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

onAuthStateChanged(auth, (user) => {
  console.log(user.metadata.creationTime);
  var accountCreationTime = new Date(user.metadata.creationTime);

  var timeStamp = Math.round(new Date().getTime() / 1000);
  var timeStampSomeTimeAgo = timeStamp - (3 * 3600);
  var timeSomeTimeAgo= new Date(timeStampSomeTimeAgo*1000).getTime();

  if(accountCreationTime.getTime() > timeSomeTimeAgo ) {
    //alert("less than one hour ago");
  } else {
    setupUI(user);
  }
  
});


const setupUI = (user) => {
  if(user) {
    window.location.href= myAccountURL;
    // alert("Esti deja inscris! Apasa OK apoi LOGOUT daca vrei sa inscrii pe altcineva");
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
