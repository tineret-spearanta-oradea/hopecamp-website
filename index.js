const popup = document.querySelector(".popup-nav");
const navigation = document.querySelector(".navigation");
const navbtn = document.querySelector(".burger-menu").addEventListener("click", function() {
    if(popup.style.opacity == "0") {
        // popup.style.display = "flex";
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
        // popup.style.top = "70px";
        // navigation.style.backgroundColor = "rgb(66, 75, 84)";
    } else {
        // popup.style.display = "none";
        popup.style.visibility = "hidden";
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
      // popup.style.visibility = "hidden";
    } else {
      panel.style.display = "block";
      // popup.style.visibility = "visile";

    }
  });
}


function searchFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.querySelector(".questions-container");
  li = document.querySelectorAll(".panel");
  accordion = document.querySelectorAll(".accordion");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("p")[0];
      acc = accordion[i];
      txtValue = acc.innerText || a.innerText;
      if (acc.innerText.toUpperCase().indexOf(filter) > -1 || a.innerText.toUpperCase().indexOf(filter) > -1 ) {
          li[i].style.display = "";
          acc.style.display = "";

      } else {
          li[i].style.display = "none";
          acc.style.display = "none";
      }
  }
}



// COUNTDOWN
(function () {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year 🙂
  //remove this if you don't need it
  let today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear(),
    nextYear = yyyy,
    dayMonth = "07/29/",
    birthday = dayMonth + yyyy;

  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end

  const countDown = new Date(birthday).getTime(),
    x = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;

      (document.getElementById("days").innerText = Math.floor(distance / day)),
        (document.getElementById("hours").innerText = Math.floor(
          (distance % day) / hour
        )),
        (document.getElementById("minutes").innerText = Math.floor(
          (distance % hour) / minute
        )),
        (document.getElementById("seconds").innerText = Math.floor(
          (distance % minute) / second
        ));

      //do something later when date is reached
      if (distance < 0) {
        document.getElementById("headline").innerText = "It's my birthday!";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("content").style.display = "block";
        clearInterval(x);
      }
      //seconds
    }, 0);
})();



/// REVEAL

// document.querySelector("#inscrie-te-div").classList.add("active-scroll");
// document.querySelector("#cand").classList.add("active-scroll");
// document.querySelector("#unde").classList.add("active-scroll");
// document.querySelector("#value-prop").classList.add("active-scroll");



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
