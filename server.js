const express = require("express");
const { request } = require("http");

const app = express();
const { v4: uuidv4 } = require("uuid");

const server = require("http").Server(app);

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { room_id: req.params.room });
});

server.listen(3030);
