const express = require("express");
const router = express.Router();

const { getFinancialInsights } = require("../controllers/financialInsightsController");
const authMiddleware = require("../middleware/authMiddleware");

// GET Financial Insights
router.get("/financial-insights", authMiddleware, getFinancialInsights);

module.exports = router;