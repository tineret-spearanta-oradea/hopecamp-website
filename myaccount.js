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
let NAMEid;
let EMAILid;
let PHONEid;
let cardAdditionalHeight = 5;
let messageID = 1;

function stopLoading() {
  document.getElementById("initial-loader").style.display = 'none';
  document.getElementById("initial-loading-msg").style.display = 'none';
  document.getElementById("all-data").style.display = "inline";
  // document.getElementById("not-important-data").style.display="none";
  
}

var aboutus_button = document.getElementById("about-us").addEventListener("click", function () {
  window.location.href = aboutusURL;
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

  NAMEid = data["name"];
  EMAILid = data["email"];
  PHONEid = data["phone"];

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
  phone.innerHTML = "Nr. tel.: " + data["phone"].toString();
  age.innerHTML = "Vârsta: " + data["age"].toString();
  church.innerHTML = "Biserica: " + data["church"];
  cui_platesc.innerHTML = "Cui plătesc: " + data["cui_platesc"].toString();
  payed.innerHTML = "Achitat: " + data["payed"].toString();
  contribui.innerHTML = "Cum contribui: " + data["contribui"].toString();
  cazare_cu.innerHTML = "Preferințe cazare: " + data["cazare_cu"].toString();
  observatii_sugestii.innerHTML = "Alte obsv(MSJ TRIMISE): " + data["observatii_sugestii"].toString();

  // pfp.setAttribute('src', data["img_url"]);

  if(data["admin"]) {
    document.getElementById("admins-db").style.display = "flex";
    cardAdditionalHeight += 2;
    document.getElementById("card").style.height = (40+cardAdditionalHeight).toString() + "rem";
  }

  get(child(dbRef, `messages/${USERid}`)).then((snapshot) => {
    let numberOfExistingMsg=0;

    if (snapshot.exists()) {
      numberOfExistingMsg = countProperties(snapshot.val());
      messageID += numberOfExistingMsg;

      const msg_data = snapshot.val();
      let dateDiff = Date.now() - msg_data[numberOfExistingMsg]["time_of_send"];
      dateDiff = new Date(dateDiff).getHours();

      if(dateDiff<24) {
        // disable submit button.
        const msg_submit_btn = document.querySelector("#msg-submit");
        msg_submit_btn.value = " Trimis";
        msg_submit_btn.style.backgroundImage = "-webkit-linear-gradient(right, #c0c0c0, #838383)";
        msg_submit_btn.disabled = true;
        
        const msg_textarea = document.querySelector("#msg-text");
        msg_textarea.placeholder = `Ai trimis deja un mesaj. Reîncearcă în ${26-dateDiff}h. (mesajul trimis: '${msg_data[numberOfExistingMsg]['message']}')`;
        msg_textarea.disabled = true;
      }
    }
  });
  // .catch((error) => {
  //   console.log(error.);
  // });
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
    })
    // .catch((error) => {
    //   console.error(error.message);
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
  
});
/*
let clicksOnExpandData = 0;
const expand_data = document.getElementById("expand-data").addEventListener("click", function() {
  clicksOnExpandData ++;
  if(clicksOnExpandData%2) {
    // Show data
    document.getElementById("not-important-data").style.display="inline";
    document.getElementById("expand-data").innerHTML = "Ascunde datele tale &#9660;";
    document.getElementById("card").style.height = (93+cardAdditionalHeight).toString() + "rem";
  } else {
    // Hide data
    document.getElementById("not-important-data").style.display="none";
    document.getElementById("expand-data").innerHTML = "Afișează datele tale &#x25B6;";
    document.getElementById("card").style.height = (40+cardAdditionalHeight).toString() + "rem";
  }
});
*/
const submit_btn = document.getElementById('msg-submit').addEventListener("click", function () {
  const message_data = {
    time_of_send: Date.now(),
    message: document.getElementById("msg-text").value,
    sender_name: NAMEid,
    sender_email: EMAILid,
    sender_phone: PHONEid,
  };
  
  
  set(ref(database, 'messages/' + USERid + '/' + messageID), message_data)
  .then(function() {
    // Restricting the user to send anymore messages.
    const msg_submit_btn = document.querySelector("#msg-submit");
    msg_submit_btn.value = " Trimis";
    msg_submit_btn.style.backgroundImage = "-webkit-linear-gradient(right, #c0c0c0, #838383)";
    msg_submit_btn.disabled = true;
    document.querySelector("#msg-text").disabled = true;
  })
  .catch(function(error) {
    alert("A apărut o eroare la trimiterea mesajului tău. Va rugam incercati mai tarziu. \n(error.msg): " + error.message);
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

  // POPUP
  document.querySelector("#div-trigger-popup").addEventListener("click", function(){
      document.querySelector('.hover_bg').style.display = 'block';
  });

  let isMouseOverHover = false;
  document.querySelector(".hover_bg>div").addEventListener("mouseover", function () {
    isMouseOverHover = true;
  });
  document.querySelector(".hover_bg>div").addEventListener("mouseleave", function () {
    isMouseOverHover = false;
  });
  document.querySelector('.hover_bg').addEventListener("click", function(){
    if(!isMouseOverHover) {
      document.querySelector('.hover_bg').style.display = 'none';
    }
  });

  document.querySelector('.popupCloseButton').addEventListener("click", function(){
      document.querySelector('.hover_bg').style.display = 'none';
  });
}





function countProperties(obj) {
  var count = 0;

  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      ++count;
  }

  return count;
}

