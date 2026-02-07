// Controller for dashboard analytics.
const { store } = require("../data/store");

const getDashboard = (req, res) => {
  try {
    const revenueTotal = store.sales.reduce((sum, sale) => sum + sale.total, 0);
    const productCount = store.products.length;
    const customerCount = store.customers.length;
    const activeRepairs = store.services.filter((item) => item.status !== "Completed").length;

    res.json({
      revenueTotal,
      productCount,
      customerCount,
      activeRepairs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

module.exports = {
  getDashboard,
};
