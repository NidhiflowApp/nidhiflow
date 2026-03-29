const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { addExpense, getExpenses } = require("../controllers/expenseController");
const { deleteExpense } = require("../controllers/expenseDeleteController");
const { editExpense } = require("../controllers/expenseEditController");

// CREATE EXPENSE
router.post("/", protect, addExpense);

// GET ALL EXPENSES
router.get("/", protect, getExpenses);

// DELETE EXPENSE
router.delete("/:id", protect, deleteExpense);

// UPDATE EXPENSE
router.put("/:id", protect, editExpense);

module.exports = router;