const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { validateUpdate, validate, User } = require("../models/user");
const { Profile } = require("../models/profile");
const { Status } = require("../models/status");

router.put("/me", [auth], async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    _.pick(req.body, ["name", "about", "dp"]),
    { new: true } //unknown concept
  );
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  const token = req.header("x-auth-token");
  res.json({ ..._.pick(user, ["_id", "name", "email", "about"]), token });
});

// router.delete("/me", [auth], async (req, res) => {
//   let user = await User.findByIdAndRemove(req.user._id);
//   const profile = await Profile.findByIdAndRemove({ user: user._id });
//   if (!user)
//     return res.status(404).send("The user with the given ID was not found.");
//   res.send(`user  deleted`);
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User(_.pick(req.body, ["name", "email", "password", "about"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .json({ ..._.pick(user, ["_id", "name", "email", "about"]), token });
});

router.get("/", async (req, res) => {
  let users = await User.find().select(" -password -__v");
  if (!users || users.length < 1)
    return res.status(404).send("users are not found");
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  let user = await User.findById(userId).select("-_id -password -__v");
  const profile = await Profile.findOne({ user: userId }).select("-__v -user");
  if (!user) return res.status(404).send("user not found");
  user = { ...user._doc, profile };
  res.send(user);
});

router.get("/:id/statuses", auth, async (req, res) => {
  const userId = req.params.id;
  let my_statuses = await Status.find({ user: userId }).select("-__v");
  res.send(my_statuses);
});

router.get("/:id/statuses/latest", auth, async (req, res) => {
  const userId = req.params.id;

  const query = {
    $and: [
      { user: userId },
      { uploaded_at: { $gte: Date.yesterday() } }, // yesterday is not correct
    ],
  };

  let my_statuses = await Status.find(query).select("-__v");
  res.send(my_statuses);
});

module.exports = router;
