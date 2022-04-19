import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

const dbRef = ref(getDatabase());

let homeURL = "http://127.0.0.1:5500";
let currentURL = "";
let USERid;
let NAMEid;
let EMAILid;
let PHONEid;

function stopLoading() {
  document.getElementById("initial-loader").style.display = 'none';
  document.getElementById("initial-loading-msg").style.display = 'none';
  document.getElementById("all-data").style.display = "inline";
  document.getElementById("not-important-data").style.display="none";
  
}

var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href = homeURL + "/aboutus.html";
});


const handleData = (data) => {
  otherUIStuff();

  let email = document.getElementById("email");
  var name = document.getElementById("hello");
  var pfp = document.getElementById("pfp");
  var id_text = document.getElementById("id_text");
  var phone = document.getElementById("phone");
  var age = document.getElementById("age");
  var church = document.getElementById("church");
  var cui_platesc = document.getElementById("cui-platesc");
  var payed = document.getElementById("payed");
  var contribui = document.getElementById("contribui");
  var cazare_cu = document.getElementById("cazare-cu");
  var observatii_sugestii = document.getElementById("observatii-sugestii");

  NAMEid = name;
  EMAILid = email;
  PHONEid = phone;

  name.innerHTML = "Hello, " + data["name"];

  var QR_CODE = new QRCode("qrcode", {
    text: data["qr_id"].toString(),
    width: 100,
    height: 100,
    colorDark: "#575a73",
    colorLight: "#fbfbfb",
    correctLevel: QRCode.CorrectLevel.H,
  });

  id_text.innerHTML = "ID: " + data["qr_id"].toString();
  phone.innerHTML = "Numar telefon: <br>" + data["phone"].toString();
  age.innerHTML = "Varsta: <br>" + data["age"].toString();
  church.innerHTML = "Biserica: <br>" + data["church"];
  cui_platesc.innerHTML = "Cui platesc: <br>" + data["cui_platesc"].toString();
  payed.innerHTML = "Achitat: <br>" + data["payed"].toString();
  contribui.innerHTML = "Cum contribui: <br>" + data["contribui"].toString();
  cazare_cu.innerHTML = "Preferinte cazare: <br>" + data["cazare_cu"].toString();
  observatii_sugestii.innerHTML = "Alte observatii/sugestii: <br>" + data["observatii_sugestii"].toString();

  pfp.setAttribute('src', data["img_url"]);

  stopLoading();
}


const setupUI = (user) => {
  if(user) {
    // console.log(user.uid);
    USERid = user.uid;
    get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        handleData(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

  }
  else //user not logged
  {
    window.location.href = homeURL;
  }
}



onAuthStateChanged(auth, (user) => {
  setupUI(user);
  
});

let clicksOnExpandData = 0;
const expand_data = document.getElementById("expand-data").addEventListener("click", function() {
  clicksOnExpandData ++;
  if(clicksOnExpandData%2) {
    // Show data
    document.getElementById("not-important-data").style.display="inline";
    document.getElementById("expand-data").innerHTML = "Ascunde datele tale &#9660;";
    document.getElementById("card").style.height = "75rem";
  } else {
    // Hide data
    document.getElementById("not-important-data").style.display="none";
    document.getElementById("expand-data").innerHTML = "Afiseaza datele tale &#x25B6;";
    document.getElementById("card").style.height = "50rem";
  }
});

const submit_btn = document.getElementById('msg-submit').addEventListener("click", function () {
  const datenow = new Date();
  let message_data = {
    timestamp: datenow,
    message: document.getElementById("msg-text").value,
  };
  
  get(child(dbRef, `messages/` + USERid)).then((snapshot) => {
    let messageID = 1;
    if (snapshot.exists()) {
      var numberOfExistingMsg = countProperties(snapshot.val());
      messageID += numberOfExistingMsg;
    } else {
      // alert("No data available");
    }

    set(ref(database, 'messages/' + USERid + '/' + messageID), message_data)
    .then(function() {
      
    })
    .catch(function(error) {
      console.log(error.message);
    });;
  });
  
});

var logout_button = document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("logged out");
  })
});

function otherUIStuff() {
  // Days left pana la tabara
  const date1 = new Date();
  const date2 = new Date('7/30/2022');
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("days-left").innerHTML = diffDays.toString() + " zile";
}


function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}