

const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const myAccountURL = "/myaccount.html";
const loginURL = "/login.html";

let isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}


const inscrie_te_btn = document.querySelector(".inscrie-te-btn").addEventListener("click", function() {
    window.location.href = signupURL;
});


const accordion = document.querySelector(".accordion").addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    } 
});

// const regulament_from_navbar = document.querySelector("#reg-nav").addEventListener("click", function() {
//     let acc = document.querySelector(".accordion");
//     acc.classList.toggle("active");
//     let panel = acc.nextElementSibling;
//     if (panel.style.maxHeight) {
//         panel.style.maxHeight = null;
//     } else {
//         panel.style.maxHeight = panel.scrollHeight + "px";
//     } 
// });



if(isMobile) {
    document.querySelectorAll(".centered-text p").forEach(p => {
        p.classList.add("mobile");
    });

    document.querySelector(".grid").classList.add("mobile");
}
