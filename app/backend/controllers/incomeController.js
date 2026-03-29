const Income = require("../models/Income");

// =========================
// ADD INCOME
// =========================
exports.addIncome = async (req, res) => {
  try {
    const { date, type, category, description, paidBy, paymentMode, amount } = req.body;

    if (!date || !type || !category || !description || !paidBy || !paymentMode || !amount) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const newIncome = new Income({
      user: req.user.id,
      date,
      type,
      category,
      description,
      paidBy,
      paymentMode,
      amount
    });

    const saved = await newIncome.save();

    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =========================
// GET USER INCOMES
// =========================
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =========================
// DELETE INCOME
// =========================
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found"
      });
    }

    await income.deleteOne();

    res.status(200).json({
      message: "Income deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
