

const signupURL = "/inscrie-te.html";
const aboutusURL = "/aboutus.html";
const myAccountURL = "/myaccount.html";
const loginURL = "/login.html";

let isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}

document.querySelector("#inscrie-te-div").classList.add("active-scroll");

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
    setTimeout(function() {
        document.querySelector("#regulament-bottom").scrollIntoView();
    }, 150);
});



if(isMobile) {
    document.querySelectorAll(".centered-text p").forEach(p => {
        p.classList.add("mobile");
    });

    document.querySelector(".grid").classList.add("mobile");
    document.querySelector(".centered").classList.add("mobile");
}
