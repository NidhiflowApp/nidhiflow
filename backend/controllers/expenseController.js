const Expense = require("../models/Expense");

/* =========================
   ADD EXPENSE
========================= */
exports.addExpense = async (req, res) => {
  try {
    const { title, description, amount, category, paidBy, paymentMode, date } = req.body;

    const newExpense = new Expense({
  user: req.user._id,
  title: description || title,   // support frontend
  amount,
  category,
  paidBy,
  paymentMode,                   // ✅ ADD THIS
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