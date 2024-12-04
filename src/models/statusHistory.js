const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  oldStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StatusHistory", statusHistorySchema);
