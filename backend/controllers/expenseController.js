const Expense = require("../models/Expense");

/* =========================
   ADD EXPENSE
========================= */
exports.addExpense = async (req, res) => {
  try {
    const { title, description, amount, category, nature, paidBy, paymentMode, date } = req.body;

  const newExpense = new Expense({
  user: req.user._id,
  title: description || title,
  amount,
  category,
  nature,   // ✅ ADD THIS LINE
  paidBy,
  paymentMode,
  date,
});

    const savedExpense = await newExpense.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL EXPENSES
========================= */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE EXPENSE
========================= */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   FIX OLD DATA (TEMP)
========================= */
exports.fixOldData = async (req, res) => {
  try {
    const expenses = await Expense.find();

    for (let e of expenses) {
      const category = (e.category || "").toLowerCase();

      if (category.includes("health") || category.includes("medical")) {
        e.nature = "emergency";
      } else if (category.includes("rent") || category.includes("emi")) {
        e.nature = "fixed";
      } else if (category.includes("shopping") || category.includes("entertainment")) {
        e.nature = "wants";
      } else {
        e.nature = "variable";
      }

      await e.save();
    }

    res.json({ message: "✅ Old data updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};