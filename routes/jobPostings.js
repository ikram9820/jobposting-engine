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

router.post("/:id/bid", [auth], async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const bidder = await Bidder.findOne({
    user: userId,
    "invitationHistory.jobPostingId": id,
    "invitationHistory.status": "Invited",
  });
  if (!bidder) return res.status(403).send("Bidder is not authorized");
  res.status(203).send(`Bidding for job:${id} by ${bidder.user.name} `);
});

router.post("/:id/sendInvitation", [auth], async (req, res) => {
  const jobId = req.params.id;

  try {
    // Retrieve the job posting and matched bidders
    const jobPosting = await JobPosting.findById(jobId);
    const matchedBidders = await getMatchedBidders(jobPosting);

    // Sort the matched bidders based on their invitation history
    const sortedBidders = sortBidders(matchedBidders);

    // Send invitations in the specified sequence
    await sendInvitations(sortedBidders.slice(0, 10), jobPosting);
    await sendInvitations(sortedBidders.slice(10, 30), jobPosting);
    await sendInvitations(sortedBidders.slice(30, 50), jobPosting);

    res.status(200).send("Invitations sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending invitations");
  }
});

async function getMatchedBidders(jobPosting) {
  const matchedBidders = await Bidder.find({
    $and: [
      { skills: { $in: jobPosting.requirements } },
      { preferences: { $in: jobPosting.requirements } },
    ],
  });
  return matchedBidders;
}

function sortBidders(bidders) {
  return bidders.sort((a, b) => {
    const aLast30Days = a.invitationHistory.filter(
      (inv) => Date.now() - inv.date <= 30 * 24 * 60 * 60 * 1000
    ).length;
    const bLast30Days = b.invitationHistory.filter(
      (inv) => Date.now() - inv.date <= 30 * 24 * 60 * 60 * 1000
    ).length;
    const aLast2Months = a.invitationHistory.filter(
      (inv) => Date.now() - inv.date <= 60 * 24 * 60 * 60 * 1000
    ).length;
    const bLast2Months = b.invitationHistory.filter(
      (inv) => Date.now() - inv.date <= 60 * 24 * 60 * 60 * 1000
    ).length;

    if (aLast30Days === 0 && bLast30Days > 0) {
      return -1;
    } else if (aLast30Days > 0 && bLast30Days === 0) {
      return 1;
    } else if (aLast2Months < bLast2Months) {
      return -1;
    } else if (aLast2Months > bLast2Months) {
      return 1;
    } else if (aLast30Days < bLast30Days) {
      return -1;
    } else if (aLast30Days > bLast30Days) {
      return 1;
    } else {
      return 0;
    }
  });
}

async function sendInvitations(bidders, jobPosting) {
  const transporter = nodemailer.createTransport({
    // configure email transporter options here
    host: "smtp.example.com",
    port: 587,
    auth: {
      user: "username",
      pass: "password",
    },
  });

  for (const bidder of bidders) {
    await transporter.sendMail({
      // configure email options here
      from: "ikram9820khan@gmail.com",
      to: bidder.user.email,
      subject: "Invitation to Bid",
      text: "Hello, you have been invited to bid on a job posting.",
    });
    bidder.invitationHistory.push({ date: Date.now(), job: jobPosting.id });
    await bidder.save();
  }
}
module.exports = router;
