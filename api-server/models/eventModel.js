const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, unique: true },
  qualification: [
    { name: String, averageScore: mongoose.Types.Decimal128 },
  ],
  participants: [{ type: String }], // List of participant names
  currentMatch: {
    round: { type: Number, default: 1 },
    matchNumber: { type: Number, default: 1 },
  },
  bracket: [
    {
      round: Number,
      matches: [
        {
          matchNumber: Number,
          team1: { type: String },
          team2: { type: String },
          winner: { type: String, default: null }, // Winner of the match
        },
      ],
    },
  ],
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
