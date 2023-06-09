const Joi = require("joi");
const mongoose = require("mongoose");

const invitaionSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bidder",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  status: {
    type: String,
    enum: ["Accepted", "Rejected"],
  },
  sent_at: {
    type: Date,
    default: Date.now(),
  },
});

const Invitation = mongoose.model("Invitation", invitaionSchema);

function validateInvitation(invitation) {
  const schema = Joi.object({
    bidder: Joi.objectId().required(),
    job: Joi.objectId().required(),
  });

  return schema.validate(invitation);
}

exports.Invitation = Invitation;
exports.validate = validateInvitation;
