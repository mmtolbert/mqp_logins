const express = require("express")
const app = express();

app.use(express.static("public"));

const hostname = '127.0.0.1';
const port = 3010;

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// listen for requests
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
