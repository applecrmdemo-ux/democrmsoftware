// Lead management routes.
const express = require("express");
const {
  listLeads,
  getLead,
  createLead,
  convertLead,
  deleteLead,
} = require("../controllers/leadController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "sales", "manager"]), listLeads);
router.get("/:id", requireRole(["admin", "sales", "manager"]), getLead);
router.post("/", requireRole(["admin", "sales", "manager"]), createLead);
router.post("/:id/convert", requireRole(["admin", "sales", "manager"]), convertLead);
router.delete("/:id", requireRole(["admin", "sales", "manager"]), deleteLead);

module.exports = router;
