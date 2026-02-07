// Product inventory routes.
const express = require("express");
const {
  listProducts,
  getProduct,
  addProduct,
  updateStock,
  lowStock,
  deleteProduct,
} = require("../controllers/productController");
const { requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireRole(["admin", "manager"]), listProducts);
router.get("/low-stock", requireRole(["admin", "manager"]), lowStock);
router.get("/:id", requireRole(["admin", "manager"]), getProduct);
router.post("/", requireRole(["admin", "manager"]), addProduct);
router.patch("/:id/stock", requireRole(["admin", "manager"]), updateStock);
router.delete("/:id", requireRole(["admin", "manager"]), deleteProduct);

module.exports = router;
