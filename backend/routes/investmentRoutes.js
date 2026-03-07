const express = require("express");
const router = express.Router();
const { getInvestmentSummaryLast6Months } = require("../controllers/investmentController");
const protect = require("../middleware/authMiddleware");

router.get(
  "/summary-last-6-months",
  protect,
  getInvestmentSummaryLast6Months
);

module.exports = router;