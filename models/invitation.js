const invitaionSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bidder",
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
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
    jobPosting: Joi.objectId().required(),
  });

  return schema.validate(invitation);
}

exports.Invitation = Invitation;
exports.validate = validateInvitation;
