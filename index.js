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