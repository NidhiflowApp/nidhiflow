const express = require("express");
const router = express.Router();
const Config = require("../models/Config");
const protect = require("../middleware/authMiddleware"); // must exist

// GET CONFIG
router.get("/", protect, async (req, res) => {
  let config = await Config.findOne({ user: req.user.id });

  if (!config) {
    config = await Config.create({ user: req.user.id });
  }

  res.json(config);
});

// UPDATE INCOME RECEIVERS
router.put("/income-receivers", protect, async (req, res) => {
  const { incomeReceivedBy } = req.body;

  let config = await Config.findOne({ user: req.user.id });

  if (!config) {
    config = await Config.create({ user: req.user.id });
  }

  config.incomeReceivedBy = incomeReceivedBy;
  await config.save();

  res.json(config);
});

module.exports = router;
