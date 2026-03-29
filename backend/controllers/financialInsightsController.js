const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.getFinancialInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const [year, monthNum] = month.split("-");
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    /* ================= FETCH DATA ================= */

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const income = await Income.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

/* ================= LAST 6 MONTHS TREND ================= */

const baseDate = new Date(year, monthNum - 1, 1);

const sixMonthsAgo = new Date(baseDate);
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

const monthlyTrendAgg = await Expense.aggregate([
  {
    $match: {
      user: userId,
    date: { 
      $gte: sixMonthsAgo,
      $lt: endDate }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" }
      },
      totalAmount: { $sum: "$amount" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 }
  }
]);

const monthlyTrend = monthlyTrendAgg.map(item => ({
  year: item._id.year,
  month: item._id.month,
  amount: item.totalAmount
}));

/* ================= CATEGORY SPLIT ================= */

// Mapping Description -> Main Category
const categoryMapping = {
  // Fixed
  "Rent": "Fixed Expenses",
  "EMI": "Fixed Expenses",
  "Insurance": "Fixed Expenses",
  "School Fees": "Fixed Expenses",

  // Variable
  "Groceries": "Variable Expenses",
  "Fuel": "Variable Expenses",
  "Electricity": "Variable Expenses",

  // Wants
  "Dining Out": "Wants / Buffer",
  "Shopping": "Wants / Buffer",
  "Entertainment": "Wants / Buffer",

  // Emergency
  "Medical": "Emergency Fund",
  "Repairs": "Emergency Fund",

  // Savings
  "Investment": "Savings & Investment"
};

const categoryMap = {};

expenses.forEach((exp) => {
  let mainCategory = "Variable Expenses";

  if (exp.nature === "fixed") {
    mainCategory = "Fixed Expenses";
  } else if (exp.nature === "emergency") {
    mainCategory = "Emergency Fund";
  } else if (exp.nature === "investment") {
    mainCategory = "Investments";
  } else if (exp.nature === "wants") {
    mainCategory = "Wants / Buffer";
  }

  categoryMap[mainCategory] =
    (categoryMap[mainCategory] || 0) + exp.amount;
});

const categorySplit = Object.entries(categoryMap).map(
  ([label, value]) => ({
    label,
    value,
  })
);

    /* ================= PAID BY ================= */

    const paidByMap = {};

    expenses.forEach((exp) => {
      paidByMap[exp.paidBy] =
        (paidByMap[exp.paidBy] || 0) + exp.amount;
    });

    const paidBy = Object.entries(paidByMap).map(
      ([label, value]) => ({
        label,
        value,
      })
    );

 /* ================= TOP 5 EXPENSE CATEGORIES (EXCLUDING INVESTMENT) ================= */

const expenseCategoryMap = {};

expenses.forEach((exp) => {
  if (exp.category === "Investment") return;

  expenseCategoryMap[exp.category] =
    (expenseCategoryMap[exp.category] || 0) + exp.amount;
});

const topCategories = Object.entries(expenseCategoryMap)
  .map(([label, value]) => ({
    label,
    value,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

    /* ================= CATEGORY BUDGET VS ACTUAL ================= */

const PlanningConfig = require("../models/PlanningConfig");

const planningConfigs = await PlanningConfig.find({
  user: userId,
  month,
});

const budgetMap = {};

// Build budget map from planning config
planningConfigs.forEach((plan) => {
  budgetMap[plan.category] = plan.amount;
});

// Build actual expense map
const actualMap = {};

expenses.forEach((exp) => {
  actualMap[exp.category] =
    (actualMap[exp.category] || 0) + exp.amount;
});

// Merge both maps
const budgetVsActual = Object.keys({
  ...budgetMap,
  ...actualMap,
}).map((category) => ({
  label: category,
  budget: budgetMap[category] || 0,
  actual: actualMap[category] || 0,
}));

    /* ================= INVESTMENT OVERVIEW ================= */

    const investmentOverview = income
      .filter((i) => i.category === "Investment")
      .map((inv) => ({
        label: inv.description,
        value: inv.amount,
      }));

    /* ================= RESPONSE ================= */

    res.json({
      monthlyTrend,
      categorySplit,
      paidBy,
      topCategories,
      budgetVsActual,
      investmentOverview,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};