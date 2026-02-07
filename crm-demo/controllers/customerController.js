// Controller for customer management.
const { store, createId } = require("../data/store");

const validateCustomer = (payload) => {
  const { name, phone, email } = payload;
  if (!name || !phone || !email) {
    return "Name, phone, and email are required";
  }
  return null;
};

const listCustomers = (req, res) => {
  try {
    res.json(store.customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to load customers" });
  }
};

const getCustomer = (req, res) => {
  try {
    const customer = store.customers.find((item) => item.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load customer" });
  }
};

const addCustomer = (req, res) => {
  try {
    const error = validateCustomer(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const customer = {
      id: createId(),
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes || "",
      salesHistory: [],
      createdAt: new Date().toISOString(),
    };

    store.customers.push(customer);
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add customer" });
  }
};

const updateCustomer = (req, res) => {
  try {
    const customer = store.customers.find((item) => item.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const payload = req.body;
    const error = validateCustomer({
      name: payload.name || customer.name,
      phone: payload.phone || customer.phone,
      email: payload.email || customer.email,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    customer.name = payload.name || customer.name;
    customer.phone = payload.phone || customer.phone;
    customer.email = payload.email || customer.email;
    customer.notes = payload.notes !== undefined ? payload.notes : customer.notes;

    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update customer" });
  }
};

const deleteCustomer = (req, res) => {
  try {
    const index = store.customers.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const [removed] = store.customers.splice(index, 1);
    return res.json({ message: "Customer deleted", customer: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete customer" });
  }
};

module.exports = {
  listCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
