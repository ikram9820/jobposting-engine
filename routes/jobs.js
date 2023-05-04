const express = require("express");
const auth = require("../middlewares/auth");
const { Job, validate } = require("../models/job");
const { Invitation } = require("../models/invitation");
const admin = require("../middlewares/admin");
const { sendInvitations } = require("./sendInvitations");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const jobs = await Job.find().populate("user", "name email").lean().exec();
  return res.status(200).json(jobs);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("user", "name email")
    .lean()
    .exec();
  if (!job) return res.status(404).send("Job is not found.");
  return res.json(job);
});

router.get("/:id/bidders", async (req, res) => {
  const bidders = await Invitation.find({ job: req.params.id }).select(
    "bidder"
  );
  // .populate("bidder", "skills preferences")
  // .lean()
  // .exec();
  // console.log(bidders);
  const bidderList = bidders.flatMap((bidder) => bidder["bidder"]);

  return res.json(bidderList);
});

router.get("/:jobId/bidders/:bidderId", async (req, res) => {
  const { bidderId, jobId } = req.params;
  console.log(req.params);
  const invitation = await Invitation.findOne({ bidder: bidderId, job: jobId });

  if (!invitation) return res.status(404).send("bidder not found");
  return res.json(invitation);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = req.user._id;
    const job = new Job({ user, ...req.body });
    await job.save();
    sendInvitations(job);
    res.status(201).json(job);
  } catch (ex) {
    res.status(500).json("some thing wrong");
  }
});

module.exports = router;
