/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const {MongoClient, ServerApiVersion} = require("mongodb");
const cookieParser = require("cookie-parser");
const express = require("express");
const fs = require("fs");
const url = require("url");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
const path = require("path");

app.set("view engine", "ejs");

const uri = "mongodb+srv://madscam505:madscam123@treasurehunt.mfetqkj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function reconnect() {
  return (await client.connect());
}
client.connect();
app.use((req, res, next)=>{
  console.log(req.cookies, req.headers);
  next();
});
app.post("/auth/signup/", async (req, res) => {
  if (!client) await reconnect();
  console.log(req.body);
  console.log(Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64"));
  if (!req.body.email || !req.body.name || !req.body.password) {
    res.send({status: "error", error: "Wrong API Data Sent"});
  } else {
    const dataUser = await client
        .db("treasureHunt")
        .collection("users")
        .findOne({token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64")});
    if (dataUser) {
      res.send({status: "error", error: "User Already Exists"});
    } else {
      await client
          .db("treasureHunt")
          .collection("users")
          .insertOne({
            token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64"), email: req.body.email, attemps: 0,
            deadends: 0, name: req.body.name, data: {
              currentStep: 1,

              time: {
                "step-1": 0,
                "step-2": 0,
                "step-3": 0,
              },
            },
          });
      res.send({status: "sucess", message: "data updated successfully", data: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64")});
    }
  }
});
app.post("/login/", async (req, res) => {
  if (!client) await reconnect();
  const dataUser = await client
      .db("treasureHunt")
      .collection("users")
      .findOne({token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64")});
  if (dataUser) {
    res.send({status: "success", data: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString("base64")});
  } else {
    res.send({status: "error", error: "Wrong Email or password"});
  }
});
app.get("/getUserDetails/", async (req, res) => {
  if (!client) await reconnect();
  const data = await client
      .db("treasureHunt")
      .collection("users")
      .find({}).toArray();
  if (data) res.send({status: "success", data});
  else res.send({status: "error", error: "User Token Issue"});
});
app.get("/treasureHunt", async (req, res) => {
  if (req.cookies.__session) {
    if (!client) await reconnect();
    const curStep = await client
        .db("treasureHunt")
        .collection("users")
        .findOne({token: req.cookies.__session});
    console.log(curStep);

    switch (curStep.data.currentStep) {
      case 1: {
        res.render("normal/login");
        break;
      }
      case 2: {
        res.render("normal/clue2");
        break;
      }
      case 3: {
        res.render("normal/clue3");
        break;
      }
      case 4: {
        res.render("normal/treasure");
        break;
      }
      case 5: {
        res.render("normal/DeadEND");
        break;
      }
      default: {
        res.redirect("/auth/");
        break;
      }
    }
  } else {
    res.redirect("/auth/");
  }
});
app.post("/setStep", async (req, res) => {
  if (!client) await reconnect();
  console.log(req.body.step);
  const setStatus = await client
      .db("treasureHunt")
      .collection("users")
      .updateOne(
          {token: req.cookies.__session},
          {$set: {data: {currentStep: req.body.step}}},
      );
  console.log(setStatus, req.cookies.__session);
  if (setStatus) {
    res.send({status: "success", message: "Step Updated Successfully"});
  } else {
    res.send({status: "error", message: "error in update"});
  }
});
app.post("/attempts", async (req, res) => {
  if (!client) await reconnect();
  const setStatus = await client
      .db("treasureHunt")
      .collection("users")
      .updateOne(
          {token: req.cookies.__session},
          {$inc: {attempts: 1}},
      );
  console.log(setStatus, req.cookies.__session);
  if (setStatus) {
    res.send({status: "success", message: "Attempts Updated Successfully"});
  } else {
    res.send({status: "error", message: "error in update"});
  }
});
app.post("/deadEnds", async (req, res) => {
  if (!client) await reconnect();
  const setStatus = await client
      .db("treasureHunt")
      .collection("users")
      .updateOne(
          {token: req.cookies.__session},
          {$inc: {deadends: 1}},
      );
    // {
    //     acknowledged: true,
    //     modifiedCount: 0,
    //     upsertedId: null,
    //     upsertedCount: 0,
    //     matchedCount: 0
    //   }
  if (setStatus) {
    res.send({status: "success", message: "Attempts Updated Successfully"});
  } else {
    res.send({status: "error", message: "error in update"});
  }
});
app.get("/:type/:view/", (req, res) => {
  if (fs.existsSync(`${__dirname}/views/${req.params.type}/${req.params.view}.ejs`)) {
    try {
      res.render(`${req.params.type}/${req.params.view}`, {url: decodeURI(path.normalize(url.parse(req.url).pathname))});
    } catch (renderError) {
      res.render("normal/404", {error: renderError, url: decodeURI(path.normalize(url.parse(req.url).pathname))});
    }
  } else {
    res.render("normal/404", {error: "Page Does Not Exists", url: decodeURI(path.normalize(url.parse(req.url).pathname))});
  }
});
app.get("/auth/", async (req, res) => {
  if (!client) await reconnect();
  if (req.cookies.__session) {
    const user = client
        .db("treasureHunt")
        .collection("users")
        .findOne({token: req.cookies.__session});
    if (user) {
      res.redirect("/treasureHunt");
    }
  } else {
    res.render("auth/signup");
  }
});
app.get("/*", async (req, res) => {
  if (!client) await reconnect();
  if (req.cookies.__session) {
    const user = client
        .db("treasureHunt")
        .collection("users")
        .findOne({token: req.cookies.__session});
    if (user) {
      res.redirect("/treasureHunt");
    }
  } else {
    res.redirect("/auth/");
  }
});
exports.app = functions.https.onRequest(app);
