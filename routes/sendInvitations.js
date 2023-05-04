const { Bidder } = require("../models/bidder");
const { Invitation } = require("../models/invitation");

async function sendInvitations(job) {
  try {
    const matchedBidders = await getMatchedBidders(job);
    invite(matchedBidders, job);
  } catch (err) {
    console.error(err);
    throw new Error("Invitation failed");
  }
}

async function getMatchedBidders(job) {
  const matchedBidders = await Bidder.find({
    $and: [
      { skills: { $in: job.requirements } },
      { preferences: { $in: job.requirements } },
    ],
  }).limit(50);
  return matchedBidders;
}

async function invite(bidders, job) {
  for (const bidder of bidders) {
    const invitation = new Invitation({ bidder, job });
    await invitation.save();
  }
}
exports.sendInvitations = sendInvitations;
