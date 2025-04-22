const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamname: { type: String, required: false },
    team: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
