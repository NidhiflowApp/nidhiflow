const mongoose = require("mongoose");

const planningConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    planningMode: {
      type: String,
      default: "golden"
    },
    fixedPercent: Number,
    variablePercent: Number,
    emergencyPercent: Number,
    investmentPercent: Number,
    wantsPercent: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlanningConfig", planningConfigSchema);