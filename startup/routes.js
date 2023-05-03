const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const bidders = require("../routes/bidders");
const job = require("../routes/jobs");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/users", users);
  app.use("/api/v1/bidders", bidders);
  app.use("/api/v1/jobs", job);
};
