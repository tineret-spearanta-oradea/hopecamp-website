import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";


const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const forgotPassURL = "/fogot_pass.html";
const adminsURL = "/admins.html";
const indexURL = "/index.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

const dbRef = ref(getDatabase());

let homeURL = "http://127.0.0.1:5500";
let currentURL = "";
let USERid;
let EMAILid;
let PHONEid;
let messageID = 1;

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

function stopLoading() {
  document.getElementById("initial-loader").style.display = 'none';
  document.getElementById("initial-loading-msg").style.display = 'none';
  document.getElementById("all-data").style.display = "inline";
  
}

var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href = aboutusURL;
});


const handleData = (data) => {
  document.getElementById("hello").innerHTML = "Hello, " + data["name"];

  var QR_CODE = new QRCode("qrcode", {
    text: data["qr_id"].toString(),
    width: 150,
    height: 150,
    colorDark: "#575a73",
    colorLight: "#fbfbfb",
    correctLevel: QRCode.CorrectLevel.H,
  });

  id_text.innerHTML = "ID: " + data["qr_id"].toString();

  if(data["admin"]) {
    document.getElementById("admins-db").style.display = "flex";
  }

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
    });
    // .catch((error) => {
    //   console.error(error);
    // });

  }
  else //user not logged
  {
    window.location.href = indexURL;
  }
}



onAuthStateChanged(auth, (user) => {
  setupUI(user);
  
});

const admins_db = document.getElementById("admins-db").addEventListener("click", function () {
  window.location.href = adminsURL;
  // when getting there, i have to check if user has admin (someone might see go to /admins manually but they have to be signed in with admins priv.)
});

var logout_button = document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("logged out");
  })
});

