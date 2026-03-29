const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: String,
  amount: Number,
  category: String,
  nature: String,
  paidBy: String,
  paymentMode: String,
  date: Date
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);