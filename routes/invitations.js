const express = require("express");
const auth = require("../middlewares/auth");
const { Invitation } = require("../models/invitation");
const router = express.Router();

router.get("/", async (req, res) => {
  let invitations = await Invitation.find({ bidder: req.params.id });
  if (!invitations)
    return res
      .status(404)
      .send("ther is no invitations related to this bidder.");
  return res.json(invitations);
});

router.get("/:id", async (req, res) => {
  let invitations = await Invitation.find({ bidder: req.params.id });
  if (!invitations)
    return res
      .status(404)
      .send("ther is no invitations related to this bidder.");
  return res.json(invitations);
});

module.exports = router;
