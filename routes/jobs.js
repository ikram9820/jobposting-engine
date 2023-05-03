const express = require("express");
const auth = require("../middlewares/auth");
const { Job, validate } = require("../models/job");
const admin = require("../middlewares/admin");
const { sendInvitations, getMatchedBidders } = require("./helpers");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  let jobs = await Job.find().populate("user", "name email").lean().exec();
  return res.status(200).json(jobs);
});

router.get("/:id", [auth, admin], async (req, res) => {
  let job = await Job.findById(req.params.id)
    .populate("user", "name email")
    .lean()
    .exec();
  if (!job) return res.status(404).send("JobPosting is not found.");
  return res.json(job);
});

router.get("/:id/bids", [auth, admin], async (req, res) => {
  let job = await Job.findById(req.params.id);
  if (!job) return res.status(404).send("JobPosting is not found.");
  return res.json(job.bids);
});
router.get("/:id/bids/:id", [auth, admin], async (req, res) => {
  console.log(req.params);
  // let jobPosting = await JobPosting.findById(req.params.id);
  // if (!jobPosting) return res.status(404).send("JobPosting is not found.");
  // return res.json(jobPosting.bids);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = req.user._id;
  const job = new Job({ user, ...req.body });
  await job.save();

  res.status(201).json(job);
});

router.post("/:id/invite", [auth, admin], async (req, res) => {
  const jobId = req.params.id;
  try {
    const Job = await Job.findById(jobId);
    const matchedBidders = await getMatchedBidders(Job);
    sendInvitations(matchedBidders, Job);
    res.status(200).send("Invitations sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending invitations");
  }
});

module.exports = router;
