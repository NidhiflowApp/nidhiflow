const Expense = require("../models/Expense");
const Income = require("../models/Income");
const categoryGroupMapping = require("../config/groupMapping");

// GET /api/budget-planning?month=YYYY-MM
exports.getBudgetPlanning = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const [year, monthNumber] = month.split("-");

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

    /* =======================
       1️⃣ FETCH INCOME
    ======================= */
    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );

    /* =======================
       2️⃣ FETCH EXPENSES
    ======================= */
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    /* =======================
       3️⃣ GET RULE (Golden / Custom)
       ⚠️ Replace this with your rule fetch logic
    ======================= */

    // Example default rule (replace later with DB rule)
    const rule = {
      fixed: 50,
      variable: 30,
      emergency: 10,
      savings: 5,
      buffer: 5
    };

    /* =======================
       4️⃣ CALCULATE GROUP BUDGETS
    ======================= */
    const groupBudgets = {
      fixed: (totalIncome * rule.fixed) / 100,
      variable: (totalIncome * rule.variable) / 100,
      emergency: (totalIncome * rule.emergency) / 100,
      savings: (totalIncome * rule.savings) / 100,
      buffer: (totalIncome * rule.buffer) / 100
    };

    /* =======================
       5️⃣ CALCULATE GROUP ACTUALS
    ======================= */
    const groupActuals = {
      fixed: 0,
      variable: 0,
      emergency: 0,
      savings: 0,
      buffer: 0
    };

    expenses.forEach((expense) => {
      const group =
        categoryGroupMapping[expense.category] || "variable";

      if (groupActuals[group] !== undefined) {
        groupActuals[group] += expense.amount;
      }
    });

    /* =======================
       6️⃣ FINAL RESPONSE
    ======================= */
    const result = [
      {
        label: "Fixed Expenses",
        budget: groupBudgets.fixed,
        actual: groupActuals.fixed
      },
      {
        label: "Variable Expenses",
        budget: groupBudgets.variable,
        actual: groupActuals.variable
      },
      {
        label: "Emergency Fund",
        budget: groupBudgets.emergency,
        actual: groupActuals.emergency
      },
      {
        label: "Savings & Investment",
        budget: groupBudgets.savings,
        actual: groupActuals.savings
      },
      {
        label: "Buffer / Wants",
        budget: groupBudgets.buffer,
        actual: groupActuals.buffer
      }
    ];

    res.json(result);

  } catch (error) {
    console.error("Budget Planning Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};