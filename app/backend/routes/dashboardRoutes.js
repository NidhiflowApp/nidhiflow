const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
  getTopCategories,
  getPaidBy,
  getCategorySplit,
  getBudgetVsActual,
  getInvestments
} = require("../controllers/dashboardController");

// ==============================
// PROTECTED DASHBOARD ROUTES
// ==============================

router.get("/", protect, getDashboard);
router.get("/top-categories", protect, getTopCategories);
router.get("/paid-by", protect, getPaidBy);
router.get("/category-split", protect, getCategorySplit);
router.get("/budget-vs-actual", protect, getBudgetVsActual);
router.get("/investments", protect, getInvestments);

module.exports = router;
