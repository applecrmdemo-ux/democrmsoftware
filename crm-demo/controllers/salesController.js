// Controller for sales and billing management.
const { store, createId } = require("../data/store");

const validateSale = (payload) => {
  const { customerId, items } = payload;
  if (!customerId) {
    return "Customer ID is required";
  }
  if (!Array.isArray(items) || items.length === 0) {
    return "At least one sale item is required";
  }
  return null;
};

const listSales = (req, res) => {
  try {
    res.json(store.sales);
  } catch (error) {
    res.status(500).json({ message: "Failed to load sales" });
  }
};

const getSale = (req, res) => {
  try {
    const sale = store.sales.find((item) => item.id === req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    return res.json(sale);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load sale" });
  }
};

const recordSale = (req, res) => {
  try {
    const error = validateSale(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const customer = store.customers.find((item) => item.id === req.body.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const saleItems = [];
    let total = 0;

    for (const item of req.body.items) {
      const product = store.products.find((entry) => entry.id === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = Number(item.quantity);
      if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const lineTotal = product.price * quantity;
      total += lineTotal;

      saleItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        lineTotal,
      });
    }

    // Reduce inventory after validation passes.
    saleItems.forEach((line) => {
      const product = store.products.find((entry) => entry.id === line.productId);
      product.stock -= line.quantity;
    });

    const sale = {
      id: createId(),
      customerId: customer.id,
      items: saleItems,
      total,
      createdAt: new Date().toISOString(),
    };

    store.sales.push(sale);
    customer.salesHistory.push(sale.id);

    return res.status(201).json(sale);
  } catch (error) {
    return res.status(500).json({ message: "Failed to record sale" });
  }
};

const deleteSale = (req, res) => {
  try {
    const index = store.sales.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const [removed] = store.sales.splice(index, 1);
    removed.items.forEach((line) => {
      const product = store.products.find((entry) => entry.id === line.productId);
      if (product) {
        product.stock += line.quantity;
      }
    });

    const customer = store.customers.find((item) => item.id === removed.customerId);
    if (customer) {
      customer.salesHistory = customer.salesHistory.filter((saleId) => saleId !== removed.id);
    }

    return res.json({ message: "Sale deleted", sale: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete sale" });
  }
};

module.exports = {
  listSales,
  getSale,
  recordSale,
  deleteSale,
};
