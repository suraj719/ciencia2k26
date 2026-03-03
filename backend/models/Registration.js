const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: { type: String, required: true },
    feeAmount: { type: Number, required: true },
    details: { type: Object, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Registration", registrationSchema);
