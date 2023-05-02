const express = require("express");
const auth = require("../middlewares/auth");
const { Bidder, validate } = require("../models/bidder");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  let bidders = await Bidder.find()
    .populate("user", "_id name email")
    .lean()
    .exec();
  return res.status(200).json(bidders);
});

router.get("/:id", async (req, res) => {
  let bidder = await Bidder.findById(req.params.id)
    .populate("user", "name email")
    .lean()
    .exec();
  if (!bidder) return res.status(404).send("JobPosting is not found.");
  return res.json(bidder);
});
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = req.user._id;
  const bidder = new Bidder({ user, ...req.body });
  await bidder.save();

  res.status(201).json(bidder);
});
module.exports = router;
