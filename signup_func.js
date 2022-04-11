function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function stoppedTyping(){
    const emailField = document.getElementById("user-email");
    
    if(validate_email(emailField.value)) { 
        document.getElementById('profile-photo').disabled = false; 
        document.getElementById("profile-photo").style.marginTop = "0.7rem";
        document.getElementById("only-email-info").innerHTML = "";
    } else { 
        document.getElementById('profile-photo').disabled = true;
        document.getElementById("profile-photo").style.marginTop = "0.02rem";
        document.getElementById("only-email-info").innerHTML = "Intai, introdu email-ul";
    }
}
