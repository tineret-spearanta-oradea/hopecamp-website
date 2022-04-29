// '/admins.html' database handling file

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set, update  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const forgotPassURL = "/fogot_pass.html";
const myaccountURL = "/myaccount.html";
const indexURL = "/index.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const dbRef = ref(getDatabase());
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

            get(child(dbRef, `users`)).then((snapshot_all) => {
                handleData(snapshot_all.val());
            })
            .catch((error) => {
                console.error(error.message);
            });

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
    window.location.href = indexURL;
  }
}

let allUsersData;
const handleData = (usersData) => {
    allUsersData = usersData;
    // num of inscrisis
    $("#nr-inscrisi").html(countProperties(usersData));


    // Getting all users info and putting them into the main table
    const table = document.querySelector("#users-table");

    Object.keys(usersData).forEach(uid => {
        let user = usersData[uid];

        let row = table.insertRow();
    
        let nume = row.insertCell(0);
        nume.innerHTML = user.name;

        let varsta = row.insertCell(1);
        varsta.innerHTML = user.age;

        let zile = row.insertCell(2);

        // Calculez diferenta de zile
        let date1 = new Date((user.start_date).toString());
        let date2 = new Date((user.end_date).toString());
        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        zile.innerHTML = `<span class="status completed">${diffDays}</span>`;

        let email = row.insertCell(3);
        email.innerHTML = user.email;

        let biserica = row.insertCell(4);
        biserica.innerHTML = user.church;

        let plata = row.insertCell(5);
        plata.innerHTML = user.cui_platesc;

        let platit = row.insertCell(6);
        platit.innerHTML = `<span class="status completed">${user.payed}</span>`;
        
        let telefon = row.insertCell(7);
        telefon.innerHTML = user.phone;

        let cazare = row.insertCell(8);
        cazare.innerHTML = user.cazare_cu;

        // let implicare = row.insertCell(9);
        // implicare.innerHTML = user.implicare;

        // let deleteuser = row.insertCell(10);
        // deleteuser.innerHTML = `<input type="button" value="X" onclick="SomeDeleteRowFunction(this);">`;
    });

    // Getting all messages info and putting them into the messages table
    const msg_table = document.querySelector("#messages-table");
    get(child(dbRef, `messages`)).then((snapshot) => { 
        let msgData = snapshot.val();
        $("#nr-mesaje").html(countProperties(msgData));

        Object.keys(msgData).forEach(msguid => {
            let messages = msgData[msguid];

            Object.keys(messages).forEach(message => {
                let msg = messages[message];
                let row = msg_table.insertRow();

                let name = row.insertCell(0);
                name.innerHTML = msg.sender_name;

                let time = row.insertCell(1);
                let T = new Date(msg.time_of_send);
                time.innerHTML = `${T.getDate()}/${T.getMonth()+1}  ${T.getHours()}:${T.getMinutes()}`;

                let email = row.insertCell(2);
                email.innerHTML = msg.sender_email;

                let telefon = row.insertCell(3);
                telefon.innerHTML = msg.sender_phone;

                let mesaj = row.insertCell(4);
                mesaj.innerHTML = msg.message;

                let deleteuser = row.insertCell(5);
                deleteuser.innerHTML = `<input type="button" value="X" onclick="SomeDeleteRowFunction(this);">`;
                
            });

            
        });



    });
    //STOP LOADING ANIMATION
}

const reset_attendance = document.getElementById("yes-delete").addEventListener("click", function () {
  Object.keys(allUsersData).forEach(uid => {
    update(ref(database, `users/${uid}`), { prezent:false });
  });
});

function countProperties(obj) {
  var count = 0;

  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      ++count;
  }

  return count;
}