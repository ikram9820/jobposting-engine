const express = require("express");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const { Bidder, validate } = require("../models/bidder");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  let bidders = await Bidder.find();

  return res.status(200).json(bidders);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("bidder is not found.");
  let bidder = await Bidder.findById(req.params.id);

  if (!bidder) return res.status(404).send("bidder is not found.");
  return res.json(bidder);
});

router.get("/:id/invitations", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("bidder is not found.");
  let bidder = await Bidder.findById(req.params.id);
  if (!bidder) return res.status(404).send("bidder is not found.");
  return res.json(bidder.invitations);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = req.user._id;
  const bidder = await Bidder.findOne({ user });
  if (bidder)
    return res.status(400).send("User is already had a bidder account.");
  bidder = new Bidder({ user, ...req.body });
  await bidder.save();

  res.status(201).json(bidder);
});
module.exports = router;
