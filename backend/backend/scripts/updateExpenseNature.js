require("dotenv").config({ path: "../.env" });   // ✅ Load .env

const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// ✅ Connect using .env
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to DB");

    // 🟢 FIXED EXPENSES
    await Expense.updateMany(
      { category: { $in: ["Fixed Expense", "Loan/EMI"] } },
      { $set: { nature: "fixed" } }
    );

    // 🔴 EMERGENCY (Health - hospital)
    await Expense.updateMany(
      { category: "Health", description: /hospital/i },
      { $set: { nature: "emergency" } }
    );

    // 🔴 EMERGENCY (Repairs / Service)
    await Expense.updateMany(
      { description: /repair|service/i },
      { $set: { nature: "emergency" } }
    );

    // 🟡 INVESTMENT
    await Expense.updateMany(
      { category: "Investment" },
      { $set: { nature: "investment" } }
    );

    // 🟢 DEFAULT → VARIABLE (for remaining)
    await Expense.updateMany(
      { nature: { $exists: false } },
      { $set: { nature: "variable" } }
    );

    console.log("🎉 Expense nature updated successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });