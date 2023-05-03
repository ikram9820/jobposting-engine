const Joi = require("joi");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  description: String,
  requirements: [String],
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bidder",
        required: true,
      },
      amount: { type: Number, required: true },
      date: Date,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

function validateJobPosting(jobPosting) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    requirements: Joi.array().items(Joi.string().required()),
  });

  return schema.validate(jobPosting);
}

exports.Job = Job;
exports.validate = validateJobPosting;
