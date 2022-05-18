import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig } from "./fb_cfg.js";

const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const myAccountURL = "/myaccount.html";
const loginURL = "/login.html";

let isMobile = false;
let userLoggedIn = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if(user) {
        userLoggedIn = true;
    } else {
        userLoggedIn = false;
    }
});

document.querySelector("#inscrie-te-div").classList.add("active-scroll");
document.querySelector("#cand").classList.add("active-scroll");
document.querySelector("#unde").classList.add("active-scroll");
document.querySelector("#value-prop").classList.add("active-scroll");



function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active-scroll");
        } 
        // else {
        //     reveals[i].classList.remove("active-scroll");
        // }
    }
}
window.addEventListener("scroll", reveal);

// To check the scroll position on page load
reveal();


let inscrie_te_btn = document.querySelector(".inscrie-te-btn");
if(userLoggedIn) {
    document.querySelector("#portal-btn a").href = "/myaccount.html";
    inscrie_te_btn.innerHTML = "Înscris!";
    inscrie_te_btn.style.backgroundColor = "#5d5d5d";
    inscrie_te_btn.addEventListener("click", function() {
        window.location.href = myAccountURL;
    });
    document.querySelector("#inscrie-te-div p").innerHTML = `Te-ai înscris deja. 
    Apasă butonul pentru a merge la <span style="font-family:poppins-bold;">contul meu</span>.`;

} else {
    inscrie_te_btn.addEventListener("click", function() {
        window.location.href = signupURL;
    });
}

const accordion = document.querySelector(".accordion").addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = document.querySelector(".panel");
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    } 
    setTimeout(function() {
        document.querySelector("#regulament-bottom").scrollIntoView();
    }, 150);
});

const menu_btn = document.querySelector("#menu-btn");

window.addEventListener('resize', function(event){
    var newWidth = window.innerWidth;
    if(newWidth<600) {
        portraitMode();
    } else {
        landscapeMode();
    }
});

if(isMobile) {
    document.querySelector("#background-video").style.height = "15em";
    document.querySelector(".centered").classList.add("mobile");
    portraitMode();
    
} else {

}

function portraitMode() {
    document.querySelectorAll(".centered-text p").forEach(p => {
        p.classList.add("mobile");
    });

    document.querySelector(".grid").classList.add("mobile");
    document.querySelector(".centered").classList.add("mobile");

    document.querySelector("#navbar").innerHTML = 
        `<a id="trigger-popup" href="javascript:void(0);" class="icon"><i class="bx bx-menu"></i></a>\
        <div id="portal-btn">
            <a href="/login.html" class='bx bxs-user'></a>
        </div>`;

    if(userLoggedIn) {
        document.querySelector("#contul-meu-a").style.display = "inline";
    } else {
        document.querySelector("#inscrie-te-a").style.display = "inline";
    }

    // POPUP setup
    document.querySelector("#trigger-popup").addEventListener("click", function(){
        let popup = document.querySelector('.hover_bg');
        popup.style.display === 'block' ? popup.style.display = 'none' : popup.style.display = 'block';
        
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
    let a_btns = document.querySelectorAll('.hover_bg div a');
    a_btns.forEach(a => {
        a.addEventListener("click", function() {
            document.querySelector('.hover_bg').style.display = 'none';
        });
    });
}

function landscapeMode() {
    document.querySelectorAll(".centered-text p").forEach(p => {
        p.classList.remove("mobile");
    });

    document.querySelector(".grid").classList.remove("mobile");
    document.querySelector(".centered").classList.remove("mobile");

    document.querySelector("#navbar").innerHTML = 
        `<a href="#despre">Despre</a>
        <a href="#galerie">Galerie</a>
        <a href="#cine-suntem">TSO</a>
        <a href="#intrebari">Întrebări</a>
        <a onclick="onClickRegNav()" href="javascript:void(0);" id="reg-nav">Regulament</a>`;

}