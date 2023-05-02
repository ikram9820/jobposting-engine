const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const bidders = require("../routes/bidders");
const jobPostings = require("../routes/jobPostings");
const matchBidders = require("../routes/matchBidders");
const invitations = require("../routes/invitations");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/users", users);
  app.use("/api/v1/bidders", bidders);
  app.use("/api/v1/jobPostings", jobPostings);
  app.use("/api/v1/matchBidders", matchBidders);
  app.use("/api/v1/invitations", invitations);
};