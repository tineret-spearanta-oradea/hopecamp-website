
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

var scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5, mirror: false});
scanner.addListener('scan', function(content){
    let current_log = document.querySelector("#current-log p");

    console.log(content);
    if(!isNaN(content)){
        // UI handling
        current_log.parentElement.classList.add("loading-database");
        current_log.innerHTML = `Adding to database... ID=${content}`;
        let user_name="", user_uid="";

        // Get user's name by knowing his ID
        Object.keys(usersData).forEach(uid => {
            let user = usersData[uid];
            if(user.qr_id == parseInt(content)) {
                user_name = user.name;
                user_uid = uid; 
            }
        });

        // Push prezent to database
        update(ref(database, `users/${user_uid}`), { prezent:true });

        current_log.parentElement.classList.add("show-result");
        current_log.innerHTML = `&#x2713; ${user_name} ID=${content}`;

        let logs = document.querySelector("#logs p");
        let logs_text = logs.innerHTML;
        let now = new Date();
        logs.innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${user_name} (ID: ${content})<br>${logs_text}`;

        setTimeout(backToReadingUI, 2500);
        
    } else {
        current_log.parentElement.classList.add("loading-database");
        current_log.innerHTML = `QR CODE NOT VALID`;

        setTimeout(backToReadingUI, 2500);
    }
});

function backToReadingUI(){
    let current_log = document.querySelector("#current-log p");
    current_log.parentElement.classList.remove("show-result");
    current_log.parentElement.classList.remove("loading-database");
    current_log.innerHTML = "Reading...";

}

Instascan.Camera.getCameras().then(function (cameras){
    if(cameras.length>0){
        scanner.start(cameras[0]);
        $('[name="options"]').on('change',function(){
            if($(this).val()==1){
                if(cameras[0]!=""){
                    scanner.start(cameras[0]);
                }else{
                    alert('No Front camera found!');
                }
            }else if($(this).val()==2){
                if(cameras[1]!=""){
                    scanner.start(cameras[1]);
                }else{
                    alert('No Back camera found!');
                }
            }
        });
    }else{
        console.error('No cameras found.');
        alert('No cameras found.');
    }
}).catch(function(e){
    console.error(e);
    alert(e);
});



function countProperties(obj) {
  var count = 0;

  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      ++count;
  }

  return count;
}