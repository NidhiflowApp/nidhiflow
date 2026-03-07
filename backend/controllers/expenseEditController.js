const Expense = require("../models/Expense");

exports.editExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    const { title, category, paidBy, paymentMode, amount, date } = req.body;

    expense.title = title || expense.title;
    expense.category = category || expense.category;
    expense.paidBy = paidBy || expense.paidBy;
    expense.paymentMode = paymentMode || expense.paymentMode;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;

    const updated = await expense.save();

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
