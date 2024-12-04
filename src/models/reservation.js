const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  client: { name: String, phone: String },
  adress: String,
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "in_progess", "completed"],
    default: "pending",
  },
  date: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
});

module.exports = mongoose.model("Reservation", reservationSchema);
