const Joi = require("joi");
const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bidder",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  amount: Number,
});

const Bid = mongoose.model("Bid", bidSchema);

function validateBid(bid) {
  const schema = Joi.object({
    bidder: Joi.objectId().required(),
    job: Joi.objectId().required(),
    amount: Joi.number().min(0).required(),
  });

  return schema.validate(bid);
}

exports.Bid = Bid;
exports.validate = validateBid;
