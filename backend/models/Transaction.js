const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    description: String,
    category: String,
    paidBy: String,
    paymentMode: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);