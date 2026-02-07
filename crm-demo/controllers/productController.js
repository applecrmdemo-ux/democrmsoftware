// Controller for product inventory management.
const { store, createId } = require("../data/store");

const validateProduct = (payload) => {
  const { name, category, price, stock } = payload;
  if (!name || !category) {
    return "Name and category are required";
  }
  if (price === undefined || Number.isNaN(Number(price))) {
    return "Valid price is required";
  }
  if (stock === undefined || Number.isNaN(Number(stock))) {
    return "Valid stock is required";
  }
  return null;
};

const listProducts = (req, res) => {
  try {
    res.json(store.products);
  } catch (error) {
    res.status(500).json({ message: "Failed to load products" });
  }
};

const getProduct = (req, res) => {
  try {
    const product = store.products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load product" });
  }
};

const addProduct = (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const product = {
      id: createId(),
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      createdAt: new Date().toISOString(),
    };

    store.products.push(product);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add product" });
  }
};

const updateStock = (req, res) => {
  try {
    const product = store.products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { stock } = req.body;
    if (stock === undefined || Number.isNaN(Number(stock))) {
      return res.status(400).json({ message: "Valid stock is required" });
    }

    product.stock = Number(stock);
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update stock" });
  }
};

const lowStock = (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const lowStockItems = store.products.filter((item) => item.stock <= threshold);
    res.json({ threshold, items: lowStockItems });
  } catch (error) {
    res.status(500).json({ message: "Failed to load low stock items" });
  }
};

const deleteProduct = (req, res) => {
  try {
    const index = store.products.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [removed] = store.products.splice(index, 1);
    return res.json({ message: "Product deleted", product: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  listProducts,
  getProduct,
  addProduct,
  updateStock,
  lowStock,
  deleteProduct,
};
