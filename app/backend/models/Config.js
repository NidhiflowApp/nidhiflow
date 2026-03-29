const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  incomeReceivedBy: {
    type: [String],
    default: ["Self"]
  },
  expensePaidBy: {
    type: [String],
    default: ["Self"]
  }
});

module.exports = mongoose.model("Config", configSchema);
