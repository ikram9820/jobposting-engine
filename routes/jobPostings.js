const express = require("express");
const auth = require("../middlewares/auth");
const { JobPosting, validate } = require("../models/jobPosting");
const { Bidder } = require("../models/bidder");
const router = express.Router();

router.get("/", async (req, res) => {
  let jobPostings = await JobPosting.find()
    .populate("user", "name email")
    .lean()
    .exec();
  return res.status(200).json(jobPostings);
});

router.get("/:id", async (req, res) => {
  let jobPosting = await JobPosting.findById(req.params.id)
    .populate("user", "name email")
    .lean()
    .exec();
  if (!jobPosting) return res.status(404).send("JobPosting is not found.");
  return res.json(jobPosting);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = req.user._id;
  const jobPosting = new JobPosting({ user, ...req.body });
  await jobPosting.save();

  res.status(201).json(jobPosting);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const jobPosting = await JobPosting.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (!jobPosting) return res.status(404).send("job post is not found.");
  res.json(jobPosting);
});

router.delete("/:id", [auth], async (req, res) => {
  let jobPosting = await JobPosting.findByIdAndRemove(req.params.id);
  if (!jobPosting) return res.status(404).send("Job Post is not found.");
  res.status(203).send("Job post is deleted");
});

router.post("/:id/sendInvitation", [auth], async (req, res) => {
  const id = req.params.id;
  const bidders = Bidder.find();
  const jobPosting = await JobPosting.findById(id);
  const matchedBidders = matchBidders(jobPosting, bidders); //demo
  res
    .status(203)
    .send(
      `Sending invitation for job:${jobPosting.title} to ${matchedBidders}`
    );
});

router.post("/:id/bid", [auth], async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const bidders = Bidder.findById(userId);
  res.status(203).send(`Bidding for job:${id} by ${bidders.user.name} `);
});

function matchBidders(jobPosting, bidders) {
  return "ikram, khan, Inam";
}

module.exports = router;
