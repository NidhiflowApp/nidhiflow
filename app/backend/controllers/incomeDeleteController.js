const Income = require("../models/Income");

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
