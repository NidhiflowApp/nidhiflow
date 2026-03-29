const cron = require("node-cron");
const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

cron.schedule("0 22 1 * *", async () => {
  console.log("🟢 Monthly Report Job Started...");

  try {
    const users = await User.find();

    for (const user of users) {
      const now = new Date();

      // Get previous month
      const firstDayPrevMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const lastDayPrevMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
      );

      const incomes = await Income.find({
        user: user._id,
        date: { $gte: firstDayPrevMonth, $lte: lastDayPrevMonth }
      });

      const expenses = await Expense.find({
        user: user._id,
        date: { $gte: firstDayPrevMonth, $lte: lastDayPrevMonth }
      });

      if (incomes.length === 0 && expenses.length === 0) {
        console.log(`⏭ Skipping ${user.email} (No data)`);
        continue;
      }

      console.log(`📊 Report for ${user.email}`);
      console.log(`Income count: ${incomes.length}`);
      console.log(`Expense count: ${expenses.length}`);
    }

    console.log("✅ Monthly Report Job Completed");
  } catch (error) {
    console.error("❌ Monthly Job Error:", error.message);
  }

}, {
  timezone: "Asia/Kolkata"
});