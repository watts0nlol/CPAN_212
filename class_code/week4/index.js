/* Project setup: For the server
1 - new project folder
2 - open an integrated terminal
3 - run these commands:
    npm init -y
    npm i express nodemon
    (optional) -> go into package.json and add "type": "module" to enable import from 
*/

// [Please enable only ONE of these]
import express from "express";
import logger from "./middleware/logger.js"; 
import auth from "./middleware/auth.js";// if you are using type: module
//const express = require("express"); // if using common JS (Default)

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logger); //application wide, run everywhere - Grug 
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get("/", logger, (req, res) => {
  res.send("Welcome to our server");
});

app.get("/about", logger, (req, res) => {
  res.send("Welcome to about page");
});

app.get("/login", (req, res) => {
  res.send("Login Recieved");
});

//app.post("/login", parseData, checkDB, checkPassword, twoFACheck, returnStatement)

app.post("/login", (req, res) => {
  res.send("We took everything.");
});

app.get("/fetchData", auth, (req, res) => {
  res.send("Hi Alex. I got data. Thank Grug. - Grug ");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
