const { Bidder } = require("../models/bidder");

async function getMatchedBidders(job) {
  const matchedBidders = await Bidder.find({
    $and: [
      { skills: { $in: job.requirements } },
      { preferences: { $in: job.requirements } },
    ],
  });
  return matchedBidders;
}

async function sendInvitations(bidders, job) {
  for (const bidder of bidders) {
    bidder.invitations.push({
      date: Date.now(),
      job: job.id,
      status: "Invited",
    });
    await bidder.save();
  }
}
exports.getMatchedBidders = getMatchedBidders;
exports.sendInvitations = sendInvitations;
