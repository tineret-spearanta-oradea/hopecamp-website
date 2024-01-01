// '/admins.html' database handling file

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, child, get, set, onValue, update  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const signupURL = "/inscrie-te";
const aboutusURL = "/aboutus";
const forgotPassURL = "/fogot_pass";
const myaccountURL = "/myaccount";
const indexURL = "/";
const loginURL = "/login";

// const signupURL = "/inscrie-te.html";
// const aboutusURL = "/aboutus.html";
// const forgotPassURL = "/fogot_pass.html";
// const myaccountURL = "/myaccount.html";
// const indexURL = "/index.html";
// const loginURL = "/login.html";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const dbRef = ref(getDatabase());
let USERid;
const QrIdDifference = 0;

let attendanceOngoing = false;
let calendarDaysCounter = {
  '2024/2/22': 0,
  '2024/2/23': 0,
  '2024/2/24': 0,
  '2024/2/25': 0,

};

onAuthStateChanged(auth, (user) => {
    setupUI(user);
});

const setupUI = (user) => {
    // START LOADING ANIMATION

    
  if(user) {
    // console.log(user.uid);
    USERid = user.uid;
    localStorage['userid'] = user.uid;
    get(child(dbRef, `users/${user.uid}/admin`)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        if(data){
            
            get(child(dbRef, `users`)).then((snapshot_all) => {
              handleData(snapshot_all.val());
              
            })
            // .catch((error) => {
            //     console.error(error.message);
            // });

            

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
      if(tr.innerHTML === uname + " (absent)" || tr.innerHTML === uname + " (prezent)" || tr.innerHTML === uname){
        tr.innerHTML = `${uname} (${uprezent ? "prezent" : "absent"})`;
        tr.parentElement.style.backgroundColor = uprezent ? "#57ea5740" : "#ea575740";

      }
    });
  } else if (mode===2) {
    nameCol.forEach(tr => {
      if(tr.innerHTML == uname + " (prezent)" || tr.innerHTML == uname + " (absent)"){
        tr.innerHTML = `${uname}`;
        tr.parentElement.style.backgroundColor = "#80808000";
      }
    });
  }

  document.querySelector("#users-table > thead > tr > th > button").click();
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
        document.querySelector("#save-edits").style.display = 'none';


        Object.keys(allUsersData).forEach(uid => {
          let user = allUsersData[uid];
          const prezentRef = ref(database, `users/${uid}/prezent`);
          onValue(prezentRef, (snapshot) => {
            const prezentRealtime = snapshot.val();
            updatePrezent(1, user.name, user.email, prezentRealtime);
          });   
        });

      } else {

        document.querySelector("#save-edits").style.display = 'none';
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

        let noid = row.insertCell(++num);
        noid.style.width = "0rem";
        noid.style.margin = "0";
        // noid.innerHTML = user.qr_id - 200;
        noid.innerHTML = `<span class="user-displayed-id">${user.qr_id-QrIdDifference}</span>`;
        let isChecked = row.insertCell(++num);
        if(user.is_confirmed) {
          isChecked.innerHTML = `<span class="user-confirmed">DA</span>`;
        } else {
          isChecked.innerHTML = `<span class="user-not-confirmed">NU</span>`;
        }

        let nume = row.insertCell(++num);
        nume.innerHTML = user.name;
        if(user.admin) {
          nume.style.color = "#57ea5790";
        }

        let varsta = row.insertCell(++num);
        if(user.age < 18) {
          varsta.innerHTML = `<span style="color:#d182ffb6">${user.age}</span>`;
        } else {
          varsta.innerHTML = user.age;
        }
        let zile = row.insertCell(++num);

        // Calculez diferenta de zile
        let date1 = new Date((user.start_date).toString());
        let date2 = new Date((user.end_date).toString());
        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let nextDate = date1;

        while (nextDate <= date2) {
          let cDay = nextDate.getDate();
          let cMonth = nextDate.getMonth() + 1;
          let cYear = nextDate.getFullYear();

          calendarDaysCounter[`${cYear}/${cMonth}/${cDay}`] ++;
          // console.log(`${nextDate} vs ${date2}`);

          nextDate.setDate(nextDate.getDate() + 1);
        }

        let status="";

        let daysAmount = diffDays;
        daysAmount = parseInt(daysAmount);

        if(daysAmount<3){
          status = "process";
        } else if(daysAmount===3){
          status = "completed";
        } 
        zile.innerHTML = `<span class="status ${status}">${daysAmount}</span>`;

        let email = row.insertCell(++num);
        email.innerHTML = `<span class="user-email">${user.email}</span>`;

        let biserica = row.insertCell(++num);
        biserica.innerHTML = user.church;

        let plata = row.insertCell(++num);
        plata.innerHTML = user.cui_platesc;

        let platit = row.insertCell(++num);

        status="";
        let payedAmount = user.payed;
        daysAmount = parseInt(daysAmount);

        if(payedAmount===0) {
          status = "pending";
        } else if(payedAmount<400 && payedAmount>0){
          status = "process";
        } else if(payedAmount == 400 || payedAmount == 450){
          status = "completed";
        } 
        platit.innerHTML = `<span class="status ${status}">${payedAmount}</span>`;
        
        let partie = row.insertCell(++num);
        partie.innerHTML = user.partie;

        let withFamily = row.insertCell(++num);
        withFamily.innerHTML = user.with_family ? `<span class="user-confirmed">da</span>` : 'nu';

        let transport= row.insertCell(++num);
        transport.innerHTML = user.transport;

        let more_info = row.insertCell(++num);
        more_info.innerHTML = `<div class="more-info-btn">More info</div>`;

        let edit = row.insertCell(++num);
        edit.innerHTML = `<div class="edit-btn">Edit info</div>`;

        let invisible1 = row.insertCell(++num); //invisible for search
        invisible1.innerHTML = user.cazare_cu;
        invisible1.style.display = "none";

        let invisible3 = row.insertCell(++num); //invisible for search
        invisible3.innerHTML = `UID:${uid} + QRID${user.qr_id} + D1:${user.date1} + D2:${user.date2} PIC:${user.img_url}`;
        invisible3.style.display = "none";

    });

    // Getting all messages info and putting them into the messages table
    const msg_table = document.querySelector("#messages-table");
    get(child(dbRef, `messages`)).then((snapshot) => { 
        let msgData = snapshot.val();
        let numberOfMessages = countProperties(msgData);
        $("#nr-mesaje").html(numberOfMessages);

        if (numberOfMessages !== 0) {
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
                  deleteuser.innerHTML = `<input type="button" value="Delete not working" onclick="SomeDeleteRowFunction(this);">`;
                  
              });
          });
        }



    });


    /* MORE INFO BUTTONS */
    let more_infos = document.querySelectorAll(".more-info-btn");

    more_infos.forEach(btn => {
      btn.addEventListener("click", function() { 
        let row = btn.parentElement.parentElement;
        // let uemail = row.querySelector(".user-email").innerHTML;
        let displayedId = row.querySelector(".user-displayed-id").innerHTML;
        // console.log(displayedId);
        Object.keys(allUsersData).forEach(uid => {
          let user = allUsersData[uid];

          if(user.qr_id - QrIdDifference == displayedId) {
            document.querySelector('.hover_bg').style.display = 'block';
            document.querySelector('.popup-title').innerHTML = `${user.name}`;

            let date1 = new Date((user.start_date).toString());
            let date2 = new Date((user.end_date).toString());
            if(date1.getMonth()+1===7){
              date1 = `${date1.getDate()}/0${date1.getMonth()+1}`;
            } else {
              date1 = `${date1.getDate()}/0${date1.getMonth()+1}`;
            }
            if(date2.getMonth()+1===7){
              date2 = `${date2.getDate()}/0${date2.getMonth()+1}`;
            } else {
              date2 = `${date2.getDate()}/0${date2.getMonth()+1}`;
            }

            let popup_text = document.querySelector('.popup-text');
            popup_text.innerHTML = 
              `<span style="font-size: 6pt">${uid}</span><br>Telefon:${user.phone}<br>QR ID: ${user.qr_id}<br>
              Data sosirii: ${date1}<br>Data plecarii: ${date2}<br>Preferințe cazare:${user.cazare_cu}<br>
                <img src="${user.img_url}" alt="pfp" height="100rem" width="auto">
              `;

                
            if(user.cazare_cu)
              popup_text += `<br>Cazare: ${user.cazare_cu}`;
            // popup_text.style.margin = "0 0 2rem 0";

            document.querySelector('.popup-text').style.color = "black";

            document.querySelector("#save-edits").style.display = 'none';
            document.querySelector("#add-admin-submit").style.display = 'none';
            document.querySelector("#email-add-admin").style.display = "none";
            document.querySelector("#yes-start-attendance").style.display = 'none';
            document.querySelector("#no-start-attendance").style.display = 'none';
            document.querySelector("#yes-delete").style.display = 'none';
            document.querySelector("#no-delete").style.display = 'none';
          }
        });
      });
    });



    // EDIT BUTTONS
    let edit_btns = document.querySelectorAll(".edit-btn");

    edit_btns.forEach(btn => {
      btn.addEventListener("click", function() { 
        let row = btn.parentElement.parentElement;
        // let uemail = row.querySelector(".user-email").innerHTML;
        let displayedId = row.querySelector(".user-displayed-id").innerHTML;

        Object.keys(allUsersData).forEach(uid => {
          let user = allUsersData[uid];

          if(user.qr_id - QrIdDifference  == displayedId) {
            // console.log(user.qr_id);

            document.querySelector('.hover_bg').style.display = 'block';

            document.querySelector('.popup-title').innerHTML = `${user.name} - EDIT`;

            let date1 = new Date((user.start_date).toString());
            let date2 = new Date((user.end_date).toString());
            if(date1.getMonth()+1===7){
              date1 = `${date1.getDate()}/0${date1.getMonth()+1}`;
            } else {
              date1 = `0${date1.getDate()}/0${date1.getMonth()+1}`;
            }
            if(date2.getMonth()+1===7){
              date2 = `${date2.getDate()}/0${date2.getMonth()+1}`;
            } else {
              date2 = `0${date2.getDate()}/0${date2.getMonth()+1}`;
            }

            let popup_text = document.querySelector('.popup-text');
            popup_text.innerHTML = 
              `<form method="post" class="form"> 
                <div style="margin: 0 auto; font-size:8pt">
               Schimbarile sunt ireversibile
                </div>
                

                <label class="edit-label" style="padding-top:0.4rem">
                    Telefon:
                </label>
                <input id="phone-edit" class="inputs-edit" type="phone" value="${user.phone}"/>

                <label class="edit-label" style="padding-top:0.4rem">
                    Cui achit:
                </label>
                <input id="cui-platesc-edit" class="inputs-edit" type="text" value="${user.cui_platesc}"/>

                <label class="edit-label" style="padding-top:0.4rem">
                    Suma achitata (deja):
                </label>
                <input id="payed-edit" class="inputs-edit" type="number" value="${user.payed}"/>

                <label class="edit-label" style="padding-top:0.4rem">
                Pârtie:
                </label>
                <input id="partie-edit" class="inputs-edit" type="text" value="${user.partie}"/>


                <label class="edit-label" style="padding-top:0.4rem">
                    Transport
                </label>
                <input id="transport-edit" class="inputs-edit" type="text" value="${user.transport}"/>

                <label class="edit-label" style="padding-top:0.4rem">
                    Preferinte cazare:
                </label>
                <input id="cazare-edit" class="inputs-edit" type="text" value="${user.cazare_cu}"/>
                
                <div style="display: inline">
                <label class="edit-label" style="padding-top:0.4rem">
                    Cu familie in tabara:
                </label>
                <input id="with-family-edit" class="inputs-edit" type="checkbox" value="confirmat" 
                ${ user.with_family ? 'checked' : '' }/>
                </div>

                <div style="display: inline">
                <label class="edit-label" style="padding-top:0.4rem">
                    Confirmat:
                </label>
                <input id="confirmat-edit" class="inputs-edit" type="checkbox" value="confirmat" 
                ${ user.is_confirmed ? 'checked' : '' }/>
                </div>

              </form>`;
            
            popup_text.style.margin = "0 0 0 0";

            document.querySelector('.popup-text').style.color = "black";

            document.querySelector("#add-admin-submit").style.display = 'none';
            document.querySelector("#email-add-admin").style.display = "none";
            document.querySelector("#yes-start-attendance").style.display = 'none';
            document.querySelector("#no-start-attendance").style.display = 'inline';
            document.querySelector("#save-edits").style.display = 'inline';
            document.querySelector("#yes-delete").style.display = 'none';
            document.querySelector("#no-delete").style.display = 'none';

            
            const save_edits = document.getElementById("save-edits").addEventListener("click", function (){ 
              let phoneUpdate = document.querySelector("#phone-edit").value;
              let cuiAchitUpdate = document.querySelector("#cui-platesc-edit").value;
              let payedUpdate = parseInt(document.querySelector("#payed-edit").value);
              let partieUpdate = document.querySelector("#partie-edit").value;
              let transportUpdate = document.querySelector("#transport-edit").value;
              let cazareUpdate = document.querySelector("#cazare-edit").value;
              let isConfirmed = document.querySelector("#confirmat-edit").checked;
              let withFamily = document.querySelector("#with-family-edit").checked;

              // console.log(uid, user.qr_id - 200, displayedId);
              let data_to_update = {
                phone: phoneUpdate,
                cui_platesc: cuiAchitUpdate,
                payed: payedUpdate,
                partie: partieUpdate,
                transport: transportUpdate,
                cazare_cu: cazareUpdate,
                is_confirmed:  isConfirmed,
                with_family: withFamily,
              };
              //TODO: send email
              update(ref(database, `users/${uid}`), data_to_update).then(function(){
                location.reload();
                document.getElementById('Statistica').scrollIntoView();

              });
            });
          }
        });
      });
    });

    // Calendar data
   

    //STOP LOADING ANIMATION
    document.querySelector("#loader").style.display = "none";
    document.querySelector("#sidebar").style.display = "block";
    document.querySelector("#content").style.display = "block";

    // console.log(calendarDaysCounter);
     Object.keys(calendarDaysCounter).forEach(dt => {
      document.getElementById(dt).innerHTML = calendarDaysCounter[dt];

    });
}

const logout_button = document.getElementById("logout-btn").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("logged out");
  })
});

const start_attendance = document.getElementById("yes-start-attendance").addEventListener("click", function () {
  update(ref(database), { attendance_ongoing : true });
});



const reset_attendance = document.getElementById("yes-delete").addEventListener("click", function () {
  Object.keys(allUsersData).forEach(uid => {
    update(ref(database, `users/${uid}`), { prezent:false });
  });
  
  update(ref(database), { attendance_ongoing : false });  
});


const add_admin = document.querySelector("#add-admin-submit").addEventListener("click", function () {
  let emailToAdd = document.querySelector("#email-add-admin").value;
  
  Object.keys(allUsersData).forEach(uid => {
    let user = allUsersData[uid];
    let foundUserWithEmail = false;
    if(user.email === emailToAdd) {
      update(ref(database, `users/${uid}`), { admin:true, is_confirmed:true }).then(function() {
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



const exportFromDb = document.querySelector("#btnExport").addEventListener("click", function () {
  let USERid = localStorage['userid'];
  get(child(dbRef, `users/${USERid}/admin`)).then((snapshot) => {
    if (snapshot.exists()) {
      let data = snapshot.val();
      if(data){
          get(child(dbRef, `users`)).then((snapshot_all) => {
            exportData(snapshot_all.val());
            
          })
      } else {
          window.location.href = myaccountURL;
      }
    } else {
      console.log("No data available");
    }
  });
});

const exportData = (usersData) => {
  var csvContent = "DisplayId,Nume,Confirmat,Email,Telefon,Varsta,Biserica,Cui platesc," +
  "Suma achitata,Partie,Cu familie in tabara,Transport,Preferinte cazare,Data in care vine,Data in care pleaca,URL catre poza\n";
  Object.keys(usersData).forEach(uid => {
    let user = allUsersData[uid];
    // csvContent += uid;
    //replace with the line above if you want to export the DB id
    csvContent += user.qr_id-200;
    csvContent += ",";
    csvContent += user.name;
    csvContent += ",";
    csvContent += user.is_confirmed ? 'DA' : 'NU';
    csvContent += ",";
    csvContent += user.email;
    csvContent += ",";
    csvContent += user.phone;
    csvContent += ",";
    csvContent += user.age;
    csvContent += ",";
    let replacedChurch = user.church.replace(/,/g, ' - ');
    csvContent += replacedChurch;
    csvContent += ",";
    csvContent += user.cui_platesc;
    csvContent += ",";
    csvContent += user.payed;
    csvContent += ",";
    csvContent += user.partie;
    csvContent += ",";
    csvContent += user.with_family ? 'DA' : 'NU';
    csvContent += ",";
    csvContent += user.transport;
    csvContent += ",";
    let replacedCazareCu = user.cazare_cu.replace(/,/g, ';');
    csvContent += replacedCazareCu;
    csvContent += ",";
    csvContent += user.start_date;
    csvContent += ",";
    csvContent += user.end_date;
    csvContent += ",";
    csvContent += user.img_url;
    csvContent += "\n";
  });
  console.log(csvContent);

  const now = new Date();
  var filename = `Participanti_HC_${now.getDay()}-${now.getMonth()}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}