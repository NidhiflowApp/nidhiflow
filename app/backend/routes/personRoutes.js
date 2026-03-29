const express = require("express");
const router = express.Router();
const Person = require("../models/Person");

// Get all persons
router.get("/", async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Person deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new person
router.post("/", async (req, res) => {
  try {
    // 🚫 Restrict to 6 persons only
    const count = await Person.countDocuments();
    if (count >= 6) {
      return res.status(400).json({
        message: "Maximum 6 persons allowed"
      });
    }

    // 🚫 Name validation
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const name = req.body.name.trim();

    // 🚫 Prevent duplicate
    const existing = await Person.findOne({ name });
    if (existing) {
      return res.status(400).json({
        message: "Person already exists"
      });
    }

    const newPerson = new Person({ name });
    const savedPerson = await newPerson.save();

    res.status(201).json(savedPerson);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;