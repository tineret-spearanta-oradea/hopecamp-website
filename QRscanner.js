import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set, update  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const adminsURL = "/admins.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

const dbRef = ref(getDatabase());


let usersData;
get(child(dbRef, `users`)).then((snapshot) => {
    if (snapshot.exists()) {
        usersData = snapshot.val();
    }
})
.catch((error) => {
    console.log(error.message);
});;

qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = true;

qrcode.callback = res => {
    if (res) {
        // scanning = false;
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
            update(ref(database, `users/${user_uid}`), { prezent:true });

            document.querySelector("body").style.backgroundColor = "#2d5c3f";
            current_log.parentElement.classList.add("show-result");
            current_log.innerHTML = `&#x2713; ${user_name} ID=${res}`;

            let logs = document.querySelector("#logs p");
            let logs_text = logs.innerHTML;
            let now = new Date();
            logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${user_name} (ID: ${res})<br>${logs_text}`;

            setTimeout(backToReadingUI, 2500);
            
        } else {
            current_log.parentElement.classList.add("loading-database");
            current_log.innerHTML = `QR CODE NOT VALID`;

            setTimeout(backToReadingUI, 2500);
        }
    // outputData.innerText = res;
    // scanning = false;

    // video.srcObject.getTracks().forEach(track => {
    //   track.stop();
    // });

    // qrResult.hidden = false;
    // canvasElement.hidden = true;
    // btnScanQR.hidden = false;


  }
};


function backToReadingUI(){
    document.querySelector("body").style.backgroundColor = "#353a36";
    let current_log = document.querySelector("#current-log p");
    current_log.parentElement.classList.remove("show-result");
    current_log.parentElement.classList.remove("loading-database");
    current_log.innerHTML = "Reading...";
    // scanning = true;

}


// btnScanQR.onclick = () => {
navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
    //   scanning = true;
        qrResult.hidden = true;
        btnScanQR.hidden = true;
        canvasElement.hidden = false;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.srcObject = stream;
        video.play();
        tick();
        scan();
    });
// };

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning &&  requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
