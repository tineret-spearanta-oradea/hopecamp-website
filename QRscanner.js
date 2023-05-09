import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set, update  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const adminsURL = "/admins";
const loginURL = "/login";
const myaccountURL = "/myaccount";

// const adminsURL = "/admins.html";
// const loginURL = "/login.html";
// const myaccountURL = "/myaccount.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

const dbRef = ref(getDatabase());

qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
let USERid;

onAuthStateChanged(auth, (user) => {
    setupUI(user);
});

const setupUI = (user) => {
// START LOADING ANIMATION
    
  if(user) {
    // console.log(user.uid);
    USERid = user.uid;
    get(child(dbRef, `users/${user.uid}/admin`)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        if(data){

          //make current user (admin) prezent.
    
          if(USERid !== "") {

            update(ref(database, `users/${USERid}`), { prezent:true })
            .then(function() {            
              let logs = document.querySelector("#logs p");
              let logs_text = logs.innerHTML;
              let now = new Date();
              if(now.getMinutes()<10 && now.getSeconds()>=10) {
                logs.innerHTML = `${now.getHours()}:0${now.getMinutes()}:${now.getSeconds()} - Current admin<br>${logs_text}`;
              } 
              else if(now.getMinutes()>=10 && now.getSeconds()<10) {
                logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:0${now.getSeconds()} - Current admin<br>${logs_text}`;
              } 
              else if(now.getMinutes()<10 && now.getSeconds()<10) {
                logs.innerHTML = `${now.getHours()}:0${now.getMinutes()}:0${now.getSeconds()} - Current admin<br>${user_name} (ID: ${res})<br>${logs_text}`;
              } 
              else {
                logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - Current admin<br>${user_name} (ID: ${res})<br>${logs_text}`;
              }
            })
            .catch(error => {});
          }
        } else {
            window.location.href = myaccountURL;
        }
      } else {
        console.log("No data available");
      }
    })
    // .catch((error) => {
    //   console.error(error.message);
    // });

  }
  else {
    //user not logged
    window.location.href = loginURL;
  }
}

let usersData;
get(child(dbRef, `users`)).then((snapshot) => {
    if (snapshot.exists()) {
        usersData = snapshot.val();
    }
})
.catch((error) => {
    console.log(error.message);
});;

qrcode.callback = res => {
    if (res) {
        let current_log = document.querySelector("#current-log p");

        if(!isNaN(res)){
            // UI handling
            current_log.parentElement.classList.add("loading-database");
            current_log.innerHTML = `Adding to database... ID=${res}`;
            let user_name="", user_uid="";

            // Get user's name by knowing his ID
            Object.keys(usersData).forEach(uid => {
                let user = usersData[uid];
                if(user.qr_id == parseInt(res)) {
                    user_name = user.name;
                    user_uid = uid; 
                }
            });

            // Push prezent to database
            if(user_uid !== "") {
              update(ref(database, `users/${user_uid}`), { prezent:true }).then(function() {

              })
              .catch(error => {

              });
            }
            document.querySelector("body").style.setProperty("--c1", "#205a14");
            current_log.parentElement.classList.add("show-result");
            current_log.innerHTML = `&#x2713; ${user_name} ID=${res}`;

            let logs = document.querySelector("#logs p");
            let logs_text = logs.innerHTML;
            let now = new Date();
            if(now.getMinutes()<10 && now.getSeconds()>=10) {
              logs.innerHTML = `${now.getHours()}:0${now.getMinutes()}:${now.getSeconds()} - ${user_name} (ID: ${res})<br>${logs_text}`;
            } 
            else if(now.getMinutes()>=10 && now.getSeconds()<10) {
              logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:0${now.getSeconds()} - ${user_name} (ID: ${res})<br>${logs_text}`;
            } 
            else if(now.getMinutes()<10 && now.getSeconds()<10) {
              logs.innerHTML = `${now.getHours()}:0${now.getMinutes()}:0${now.getSeconds()} - ${user_name} (ID: ${res})<br>${logs_text}`;
            } 
            else {
              logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${user_name} (ID: ${res})<br>${logs_text}`;
            }
            setTimeout(scanAgain, 500);
            // scanAgain();
        } else {
            current_log.parentElement.classList.add("loading-database");
            current_log.innerHTML = `QR CODE NOT VALID`;
            
            // scanAgain();
            setTimeout(scanAgain, 500); //just for ux
        }
    }
};


function backToReadingUI(){
   // back to reading ui
  document.querySelector("body").style.setProperty("--c1", "#353a36");
  let current_log = document.querySelector("#current-log p");
  current_log.parentElement.classList.remove("show-result");
  current_log.parentElement.classList.remove("loading-database");
  current_log.innerHTML = "Reading...";
}


function scanAgain() {
  
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            qrResult.hidden = true;
            btnScanQR.hidden = true;
            canvasElement.hidden = false;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.srcObject = stream;
            video.play();
            tick();
            scan();
        });

  setTimeout(backToReadingUI, 1500);
}

scanAgain()

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
