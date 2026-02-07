// Service and repair routes.
const express = require("express");
const {
  listServices,
  getService,
  registerService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "tech", "manager"]), listServices);
router.get("/:id", requireRole(["admin", "tech", "manager"]), getService);
router.post("/", requireRole(["admin", "tech", "manager"]), registerService);
router.patch("/:id", requireRole(["admin", "tech", "manager"]), updateService);
router.delete("/:id", requireRole(["admin", "tech", "manager"]), deleteService);

module.exports = router;
