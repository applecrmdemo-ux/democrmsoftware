// Appointment scheduling routes.
const express = require("express");
const {
  listAppointments,
  getAppointment,
  createAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "sales", "manager"]), listAppointments);
router.get("/:id", requireRole(["admin", "sales", "manager"]), getAppointment);
router.post("/", requireRole(["admin", "sales", "manager"]), createAppointment);
router.delete("/:id", requireRole(["admin", "sales", "manager"]), deleteAppointment);

module.exports = router;
