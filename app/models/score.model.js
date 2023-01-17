const mongoose = require("mongoose");

const Score = mongoose.model(
  "Score",
  new mongoose.Schema({
    username: String,
    state: String,
    date: {
      type: Date,
      default: Date.now(),
  }
  })
);

module.exports = Score;
