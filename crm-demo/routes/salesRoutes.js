// Sales and billing routes.
const express = require("express");
const { listSales, getSale, recordSale, deleteSale } = require("../controllers/salesController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "sales", "manager"]), listSales);
router.get("/:id", requireRole(["admin", "sales", "manager"]), getSale);
router.post("/", requireRole(["admin", "sales", "manager"]), recordSale);
router.delete("/:id", requireRole(["admin", "sales", "manager"]), deleteSale);

module.exports = router;
