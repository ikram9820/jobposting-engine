const Joi = require("joi");
const mongoose = require("mongoose");

const STATUS = ["Invited", "Accepted", "Rejected"];
const bidderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: [String],
  preferences: [String],
  invitationHistory: [
    {
      jobPostingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPosting",
      },
      status: {
        type: String,
        enum: STATUS,
      },
    },
  ],
});

const Bidder = mongoose.model("Bidder", bidderSchema);

function validateBidder(bidder) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    skills: Joi.array().items(Joi.string().lowercase().insensitive()),
    preferences: Joi.array().items(Joi.string().lowercase().insensitive()),
    invitationHistory: Joi.array().items(
      Joi.object({
        jobPostingId: Joi.objectId(),
        status: Joi.string().lowercase().valid(STATUS),
      })
    ),
  });

  return schema.validate(bidder);
}

exports.Bidder = Bidder;
exports.validate = validateBidder;
