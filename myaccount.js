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

var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href = homeURL + "/aboutus.html";
});

const handleData = (data) => {
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

  name.innerHTML = "Hello, " + data["name"];

  var QR_CODE = new QRCode("qrcode", {
    text: data["qr_id"].toString(),
    width: 180,
    height: 180,
    colorDark: "#575a73",
    colorLight: "#ffffff",
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
}


const setupUI = (user) => {
  if(user) {
    // console.log(user.uid);

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



var logout_button = document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("logged out");
  })
});