const Income = require("../models/Income");

exports.editIncome = async (req, res) => {
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

    const { description, category, paidBy, paymentMode, amount, date } = req.body;

    income.description = description || income.description;
    income.category = category || income.category;
    income.paidBy = paidBy || income.paidBy;
    income.paymentMode = paymentMode || income.paymentMode;
    income.amount = amount || income.amount;
    income.date = date || income.date;

    const updated = await income.save();

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
