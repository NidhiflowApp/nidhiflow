// services/reportService.js

/* ================================
   NIDHIFLOW - MONTHLY REPORT ENGINE
================================ */

/**
 * Generate Monthly Report
 * @param {Array} incomes
 * @param {Array} expenses
 * @param {Array} investments
 * @param {number} month
 * @param {number} year
 * @returns {Object} MonthlyReport
 */

export function generateMonthlyReport(
  incomes = [],
  expenses = [],
  investments = [],
  month,
  year
) {
  const filteredIncome = filterByMonth(incomes, month, year);
  const filteredExpense = filterByMonth(expenses, month, year);
  const filteredInvestment = filterByMonth(investments, month, year);

  const totalIncome = calculateTotal(filteredIncome);
  const totalExpense = calculateTotal(filteredExpense);
  const totalInvestment = calculateTotal(filteredInvestment);

  const netSavings = totalIncome - totalExpense - totalInvestment;
  const savingsRate =
    totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0;

  return {
    month,
    year,

    summary: {
      totalIncome,
      totalExpense,
      totalInvestment,
      netSavings,
      savingsRate
    },

    categorySplit: {
      incomeByCategory: groupByCategory(filteredIncome),
      expenseByCategory: groupByCategory(filteredExpense),
      investmentByCategory: groupByCategory(filteredInvestment)
    },

    trends: {
      dailyIncome: groupByDate(filteredIncome),
      dailyExpense: groupByDate(filteredExpense)
    },

    metadata: {
      generatedOn: new Date().toISOString(),
      generatedBy: "NidhiFlow",
      version: "1.0"
    }
  };
}

/* ================================
   HELPER FUNCTIONS
================================ */

function filterByMonth(data, month, year) {
  return data.filter((item) => {
    const date = new Date(item.date);
    return (
      date.getMonth() + 1 === month &&
      date.getFullYear() === year
    );
  });
}

function calculateTotal(data) {
  return data.reduce((sum, item) => sum + Number(item.amount), 0);
}

function groupByCategory(data) {
  const grouped = {};

  data.forEach((item) => {
    const category = item.category || "Others";
    grouped[category] = (grouped[category] || 0) + Number(item.amount);
  });

  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total
  }));
}

function groupByDate(data) {
  const grouped = {};

  data.forEach((item) => {
    const date = item.date;
    grouped[date] = (grouped[date] || 0) + Number(item.amount);
  });

  return Object.entries(grouped).map(([date, total]) => ({
    date,
    total
  }));
}