const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  oldReservationStatus: { type: String, required: true },
  newReservationStatus: { type: String, required: true },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relación con el modelo User
    required: true,
  },
  changedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("statusHistory", statusHistorySchema);
