const express = require("express");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const { Bidder, validate } = require("../models/bidder");
const { Invitation } = require("../models/invitation");
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

router.get("/:id/jobs", async (req, res) => {
  let jobs = await Invitation.find({ bidder: req.params.id })
    .select("-_id job")
    .populate("job", "title requirements")
    .lean()
    .exec();
  if (!jobs)
    return res.status(404).send("ther is no jobs related to this bidder.");
  let jobList = jobs.flatMap((job) => job["job"]);

  return res.json(jobList);
});

router.patch("/:bidderId/jobs/:jobId", async (req, res) => {
  const { bidderId, jobId } = req.params;
  console.log(req.params);
  const status = req.body.status;
  if (!(status === "Accepted" || status === "Rejected"))
    return res.status(400).send("status must be Accepted or Rejected");
  let invitation = await Invitation.findOneAndUpdate(
    { bidder: bidderId, job: jobId },
    { status: status }
  );

  if (!invitation) return res.status(404).send("job not found");
  return res.json(invitation);
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
