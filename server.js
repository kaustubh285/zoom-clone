const express = require("express");

const app = express();

const server = require("http").Server(app);

app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(3030);
