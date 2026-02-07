// Dashboard analytics routes.
const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "manager"]), getDashboard);

module.exports = router;
