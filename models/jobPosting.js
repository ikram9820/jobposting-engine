const Joi = require("joi");
const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  description: String,
  requirements: [String],
});

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

function validateJobPosting(jobPosting) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    requirements: Joi.array().items(Joi.string().required()),
  });

  return schema.validate(jobPosting);
}

exports.JobPosting = JobPosting;
exports.validate = validateJobPosting;
