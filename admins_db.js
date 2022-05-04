// '/admins.html' database handling file

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set, onValue, update  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const forgotPassURL = "/fogot_pass.html";
const myaccountURL = "/myaccount.html";
const indexURL = "/index.html";
const loginURL = "/login.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const dbRef = ref(getDatabase());
let USERid;

let attendanceOngoing = false;


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
            get(child(dbRef, `attendance_ongoing`)).then((snapshot_all) => {
                if(snapshot_all.val()) {
                  attendanceOngoing = true;
                }
                get(child(dbRef, `users`)).then((snapshot_all) => {
                  handleData(snapshot_all.val());
                })
                .catch((error) => {
                    console.error(error.message);
                });
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
    window.location.href = loginURL;
  }
}

function updatePrezent(mode, uname, uemail, uprezent) {
  let nameCol = document.querySelectorAll("#table-body > tr > td:nth-child(1)");
 
  if(mode===1) {
    nameCol.forEach(tr => {
      if(tr.innerHTML == uname){
        tr.innerHTML = `${uname} (${uprezent ? "prezent" : "absent"})`;
        tr.parentElement.style.backgroundColor = uprezent ? "#57ea5740" : "#ea575740";

      }
    });
  } else if (mode===2) {
    nameCol.forEach(tr => {
      if(tr.innerHTML == uname + " (prezent)" || tr.innerHTML == uname + " (absent)"){
        tr.innerHTML = `${uname}`;
      }
    });
  }
}

let allUsersData;
const handleData = (usersData) => {
    allUsersData = usersData;
    const attendanceOngoingRef = ref(database, `attendance_ongoing/`);
  

    onValue(attendanceOngoingRef, (snapshot) => {
      attendanceOngoing = snapshot.val();

      if(attendanceOngoing) {
        // document.querySelector("")
        document.querySelector("#attendance-on").style.display="inline";
        document.querySelector("#reset-attendance").style.display="inline";
        document.querySelector("#start-attendance").style.display="none";


        Object.keys(allUsersData).forEach(uid => {
          let user = allUsersData[uid];
          const prezentRef = ref(database, `users/${uid}/prezent`);
          onValue(prezentRef, (snapshot) => {
            const prezentRealtime = snapshot.val();
            updatePrezent(1, user.name, user.email, prezentRealtime);
          });   
        }); 
      } else {
        document.querySelector("#start-attendance").style.display="inline";
        document.querySelector("#attendance-on").style.display="none";
        document.querySelector("#reset-attendance").style.display="none";

        Object.keys(allUsersData).forEach(uid => {
          let user = allUsersData[uid];
          updatePrezent(2, user.name, user.email, false);

        }); 

      }
    }); 



    // num of inscrisis
    $("#nr-inscrisi").html(countProperties(usersData));


    // Getting all users info and putting them into the main table
    const table = document.querySelector("#users-table");

    Object.keys(usersData).forEach(uid => {
        let user = usersData[uid];

        let row = table.insertRow();
        let num = -1;

        let nume = row.insertCell(++num);
        nume.innerHTML = user.name;

        let varsta = row.insertCell(++num);
        if(user.age <= 18) {
          varsta.innerHTML = `<span style="color:#ffb6b6b6">${user.age}</span>`;
        } else {
          varsta.innerHTML = user.age;
        }
        let zile = row.insertCell(++num);

        // Calculez diferenta de zile
        let date1 = new Date((user.start_date).toString());
        let date2 = new Date((user.end_date).toString());
        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        zile.innerHTML = `<span class="status completed">${diffDays}</span>`;

        let email = row.insertCell(++num);
        email.innerHTML = user.email;

        let biserica = row.insertCell(++num);
        biserica.innerHTML = user.church;

        let plata = row.insertCell(++num);
        plata.innerHTML = user.cui_platesc;

        let platit = row.insertCell(++num);
        platit.innerHTML = `<span class="status completed">${user.payed}</span>`;
        
        let telefon = row.insertCell(++num);
        telefon.innerHTML = user.phone;

        let cazare = row.insertCell(++num);
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
                time.innerHTML = `${T.getDate()}/0${T.getMonth()+1} &nbsp;&nbsp; ${T.getHours()}:${T.getMinutes()}`;

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

const logout_button = document.getElementById("logout-btn").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("logged out");
  })
});

const start_attendance = document.getElementById("yes-start-attendance").addEventListener("click", function () {
  attendanceOngoing = true;

  update(ref(database), { attendance_ongoing : true });
  // location.reload();
});

const reset_attendance = document.getElementById("yes-delete").addEventListener("click", function () {
  attendanceOngoing = false;
  Object.keys(allUsersData).forEach(uid => {
    update(ref(database, `users/${uid}`), { prezent:false });
  });
  
  update(ref(database), { attendance_ongoing : false });
  // location.reload();
  
});



const add_admin = document.querySelector("#add-admin-submit").addEventListener("click", function () {
  let emailToAdd = document.querySelector("#email-add-admin").value;
  
  Object.keys(allUsersData).forEach(uid => {
    let user = allUsersData[uid];
    let foundUserWithEmail = false;
    if(user.email === emailToAdd) {
      update(ref(database, `users/${uid}`), { admin:true }).then(function() {
        document.querySelector('.popup-text').innerHTML = `L-am adaugat pe ${user.name} în lista de admini.`;
        document.querySelector('.popup-text').style.color = "green";

        document.querySelector("#add-admin-submit").style.display = "none";
        document.querySelector("#email-add-admin").style.display = "none";
        foundUserWithEmail = true;

        setTimeout(function () {
          document.querySelector('.hover_bg').style.display = 'none';
        }, 2000);
        
      }).catch(error => {
        document.querySelector('.popup-text').innerHTML = error.message;
        document.querySelector('.popup-text').style.color = "red";
        document.querySelector("#add-admin-submit").style.display = "none";
        document.querySelector("#email-add-admin").style.display = "none";
      });
    } 

    if(!foundUserWithEmail) {
      document.querySelector('.popup-text').innerHTML = "Nu exista un user cu acest email.";
      document.querySelector('.popup-text').style.color = "red";
    }
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