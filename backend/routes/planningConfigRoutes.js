const express = require("express");
const router = express.Router();

const {
  getPlanningConfig,
  savePlanningConfig
} = require("../controllers/planningConfigController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getPlanningConfig);
router.post("/", authMiddleware, savePlanningConfig);

module.exports = router;