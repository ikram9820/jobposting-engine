const mongoose = require("mongoose");

const mongoURL =
  "mongodb://ikram9820khan:3MnWoFkNdR5MJSV2@ac-6eeiln7-shard-00-00.8gkvjcv.mongodb.net:27017,ac-6eeiln7-shard-00-01.8gkvjcv.mongodb.net:27017,ac-6eeiln7-shard-00-02.8gkvjcv.mongodb.net:27017/?ssl=true&replicaSet=atlas-6pfpok-shard-0&authSource=admin&retryWrites=true&w=majority";
module.exports = connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log("this is catched error:", e);
      setTimeout(connectWithRetry, 5000);
    });
};
