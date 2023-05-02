const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { validate, User } = require("../models/user");

router.get("/", async (req, res) => {
  let users = await User.find().select(" -password -__v");
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  let user = await User.findById(userId).select("-password -__v");
  if (!user) return res.status(404).send("User is not found");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user is already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .status(201)
    .header("x-auth-token", token)
    .json({ ..._.pick(user, ["_id", "name", "email"]), token });
});

module.exports = router;
