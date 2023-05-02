const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://ikram9820khan:BPIMVkJnjEITCX2D@cluster0.8gkvjcv.mongodb.net/jobPosting?retryWrites=true&w=majority";
module.exports = connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};
