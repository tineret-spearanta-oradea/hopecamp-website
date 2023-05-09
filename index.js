const popup = document.querySelector(".popup-nav");
const navigation = document.querySelector(".navigation");
const navbtn = document.querySelector(".burger-menu").addEventListener("click", function() {
    if(popup.style.opacity == "0") {
        // popup.style.display = "flex";
        popup.style.opacity = "1";
        // popup.style.top = "70px";
        // navigation.style.backgroundColor = "rgb(66, 75, 84)";
    } else {
        // popup.style.display = "none";
        popup.style.opacity = "0";
        // popup.style.top = "-1000px";
        // navigation.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
});


// IMAGE SLIDER
let slideIndex = 0;
showSlides();
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2700); // Change image every 3 seconds
}


// ACCORDION FAQ
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}