const Income = require("../models/Income");
const Expense = require("../models/Expense");

/* =====================================================
   HELPER FUNCTION
===================================================== */
const getDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  return { startDate, endDate };
};

/* =====================================================
   MAIN DASHBOARD
===================================================== */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year & month required" });
    }

    const { startDate, endDate } = getDateRange(year, month);

    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const incomeTotal = incomes.reduce((s, i) => s + i.amount, 0);

    const expenseTotal = expenses
      .filter(e => e.category !== "Investment")
      .reduce((s, e) => s + e.amount, 0);

    const investmentTotal = expenses
      .filter(e => e.category === "Investment")
      .reduce((s, e) => s + e.amount, 0);

    const variation = incomeTotal - expenseTotal;

    let previousClosing = 0; // TODO: implement dynamic carry forward logic


    const availableFund =
      previousClosing + incomeTotal - expenseTotal - investmentTotal;

    const transactions = [
      ...incomes.map(i => ({
         _id: i._id,
        date: i.date,
        type: "Income",
        description: i.description,
        category: i.category,
        paidBy: i.paidBy,
        paymentMode: i.paymentMode,
        amount: i.amount,
      })),
      ...expenses.map(e => ({
        _id: e._id,
        date: e.date,
        type: e.category === "Investment" ? "Investment" : "Expense",
        description: e.title,
        category: e.category,
        paidBy: e.paidBy,
        paymentMode: e.paymentMode,
        amount: e.amount,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      previousClosing,
      income: incomeTotal,
      expense: expenseTotal,
      investment: investmentTotal,
      variation,
      availableFund,
      transactions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   TOP CATEGORIES
===================================================== */
exports.getTopCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    const { startDate, endDate } = getDateRange(year, month);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

const map = {};

expenses.forEach(e => {
  if (!map[e.category]) map[e.category] = 0;
  map[e.category] += e.amount;
});

    const result = Object.keys(map)
      .map(cat => ({ label: cat, value: map[cat] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   PAID BY
===================================================== */
exports.getPaidBy = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    const { startDate, endDate } = getDateRange(year, month);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const map = {};
    expenses.forEach(e => {
      if (!map[e.paidBy]) map[e.paidBy] = 0;
      map[e.paidBy] += e.amount;
    });

    const result = Object.keys(map).map(name => ({
      label: name,
      value: map[name],
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   CATEGORY SPLIT
===================================================== */
exports.getCategorySplit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    const { startDate, endDate } = getDateRange(year, month);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const total = expenses.reduce((s, e) => s + e.amount, 0);

 const map = {};

expenses.forEach(e => {
  let mainCategory = "Variable Expenses"; // default

  if (e.nature === "fixed") {
    mainCategory = "Fixed Expenses";
  } else if (e.nature === "emergency") {
    mainCategory = "Emergency Fund";
  } else if (e.nature === "investment") {
    mainCategory = "Investments";
  } else if (e.nature === "wants") {
    mainCategory = "Wants / Buffer";
  }

  if (!map[mainCategory]) map[mainCategory] = 0;
  map[mainCategory] += e.amount;
});

    const result = Object.keys(map).map(cat => ({
      label: cat,
      value: total ? Math.round((map[cat] / total) * 100) : 0,
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   BUDGET VS ACTUAL
===================================================== */
exports.getBudgetVsActual = async (req, res) => {
  res.json([]);
};

/* =====================================================
   INVESTMENTS
===================================================== */
exports.getInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    const { startDate, endDate } = getDateRange(year, month);

    const investments = await Expense.find({
      user: userId,
      category: "Investment",
      date: { $gte: startDate, $lte: endDate },
    });

    const total = investments.reduce((s, i) => s + i.amount, 0);

    res.json([
      {
        label: "Investments",
        value: total,
      },
    ]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
