const PlanningConfig = require("../models/PlanningConfig");

/* ===============================
   GET USER PLANNING CONFIG
================================= */
const getPlanningConfig = async (req, res) => {
  try {
    const userId = req.user.id;

    let config = await PlanningConfig.findOne({ userId });

    if (!config) {
      config = await PlanningConfig.create({
        userId,
        planningMode: "golden",
        fixedPercent: 50,
        variablePercent: 20,
        emergencyPercent: 10,
        investmentPercent: 10,
        wantsPercent: 10
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Get Planning Config Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================
   SAVE / UPDATE PLANNING CONFIG
================================= */
const savePlanningConfig = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      planningMode,
      fixedPercent,
      variablePercent,
      emergencyPercent,
      investmentPercent,
      wantsPercent
    } = req.body;

    const updatedConfig = await PlanningConfig.findOneAndUpdate(
      { userId },
      {
        planningMode,
        fixedPercent,
        variablePercent,
        emergencyPercent,
        investmentPercent,
        wantsPercent
      },
      { new: true, upsert: true }
    );

    res.json(updatedConfig);
  } catch (error) {
    console.error("Save Planning Config Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getPlanningConfig,
  savePlanningConfig
};