// backend/config/groupMapping.js

const categoryGroupMapping = {
  // FIXED
  "Fixed Expense": "fixed",
  "Bills": "fixed",

  // VARIABLE
  "Food": "variable",
  "Food - Non Veg": "variable",
  "Groceries": "variable",
  "Transport": "variable",

  // EMERGENCY
  "Health": "emergency",

  // SAVINGS / INVESTMENT
  "Investment": "savings",

  // BUFFER / WANTS
  "Entertainment": "buffer",
  "Shopping": "buffer",
  "Education": "buffer"
};

module.exports = categoryGroupMapping;