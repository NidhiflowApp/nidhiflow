const express = require("express");
const router = express.Router();
const PaymentMode = require("../models/PaymentMode");

// GET all payment modes
router.get("/", async (req, res) => {
  try {
    const modes = await PaymentMode.find();
    res.json(modes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD payment mode
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const name = req.body.name.trim();

    const existing = await PaymentMode.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Already exists" });
    }

    const newMode = new PaymentMode({ name });
    const saved = await newMode.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;