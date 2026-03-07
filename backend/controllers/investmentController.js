const Expense = require("../models/Expense");

exports.getInvestmentSummaryLast6Months = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentDate = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    // Aggregate from EXPENSE collection
    const investmentAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          category: "Investment",
          date: { $gte: sixMonthsAgo, $lte: currentDate }
        }
      },
      {
        $group: {
          _id: "$title",  // <-- using title instead of description
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const total = investmentAgg.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    const categories = investmentAgg.map(item => ({
      label: item._id,
      value: item.totalAmount,
      percentage: total > 0
        ? Math.round((item.totalAmount / total) * 100)
        : 0
    }));

    res.json({
      total,
      categories
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};