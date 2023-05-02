const express = require("express");
const auth = require("../middlewares/auth");
const { Invitation, validate } = require("../models/invitation");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  let invitations = await Invitation.find({ user: userId })
    .populate("jobPosting", "_id title")
    .lean()
    .exec();
  return res.status(200).json(invitations);
});

router.get("/:id", async (req, res) => {
  let invitation = await Invitation.findById(req.params.id)
    .populate("jobPosting", "title")
    .lean()
    .exec();
  if (!invitation) return res.status(404).send("Invitaion is not found.");
  return res.json(invitation);
});
module.exports = router;
