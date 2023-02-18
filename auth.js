const express = require("express");
const app = express();
const uuidv4 = require("uuid").v4;
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.json());

const sessions = {}; // sample sessions database

app.post("/login", (req, res) => {
  // suppose that all details are correct
  const { username, password } = req.body;

  const sessionId = uuidv4();

  sessions[sessionId] = username;

  res.cookie("session", sessionId); // setting cookie from server to client

  res.send("success");
});

app.post("/logout", (req, res) => {
  const sessionId = req.cookies.session;
  console.log(sessions);
  delete sessions[sessionId];
  console.log(sessions);
  res.clearCookie("session");

  res.send("success");
});

// cookies are sent along with this request to server in cookie header
app.get("/protected", (req, res) => {
  const sessionId = req.cookies.session;

  const userSession = sessions[sessionId];
  // If we are able to get this then its okay, it means that username exists in the session

  if (!userSession) {
    return res.status(401).send("INVALID SESSION");
  }

  res.send({ name: userSession });
});

app.listen(3000, () => console.log("Server running on port 3000"));
