// Customer routes.
const express = require("express");
const {
  listCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "manager", "sales"]), listCustomers);
router.get("/:id", requireRole(["admin", "manager", "sales"]), getCustomer);
router.post("/", requireRole(["admin", "manager", "sales"]), addCustomer);
router.put("/:id", requireRole(["admin", "manager", "sales"]), updateCustomer);
router.delete("/:id", requireRole(["admin", "manager", "sales"]), deleteCustomer);

module.exports = router;
