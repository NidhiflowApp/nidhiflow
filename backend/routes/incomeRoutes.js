const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { addIncome, getIncomes } = require("../controllers/incomeController");
const { deleteIncome } = require("../controllers/incomeDeleteController");
const { editIncome } = require("../controllers/incomeEditController");


// =========================
// ADD INCOME
// =========================
router.post("/", protect, addIncome);

// =========================
// GET ALL INCOME (Logged-in User)
// =========================
router.get("/", protect, getIncomes);

// =========================
// DELETE INCOME
// =========================
router.delete("/:id", protect, deleteIncome);

// =========================
// UPDATE INCOME
// =========================
router.put("/:id", protect, editIncome);


module.exports = router;
