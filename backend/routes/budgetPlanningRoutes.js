const express = require("express");
const router = express.Router();

const { getBudgetPlanning } = require("../controllers/budgetPlanningController");
const authMiddleware = require("../middleware/authMiddleware"); // use your existing auth middleware

// GET /api/budget-planning?month=YYYY-MM
router.get("/", authMiddleware, getBudgetPlanning);

module.exports = router;