const express = require("express");
const auth = require("../middlewares/auth");
const { Bidder } = require("../models/bidder");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  let bidders = await Bidder.find()
    .populate("user", "_id name email")
    .lean()
    .exec();
  return res.status(200).json(bidders);
});
