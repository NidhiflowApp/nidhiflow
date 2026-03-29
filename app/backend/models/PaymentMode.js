const mongoose = require("mongoose");

const paymentModeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model("PaymentMode", paymentModeSchema);