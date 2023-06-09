const Joi = require("joi");
const mongoose = require("mongoose");

const bidderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: [String],
  preferences: [String],
});

const Bidder = mongoose.model("Bidder", bidderSchema);

function validateBidder(bidder) {
  const schema = Joi.object({
    skills: Joi.array().items(Joi.string().lowercase().insensitive()),
    preferences: Joi.array().items(Joi.string().lowercase().insensitive()),
  });

  return schema.validate(bidder);
}

exports.Bidder = Bidder;
exports.validate = validateBidder;
