// Controller for lead management and conversion.
const { store, createId } = require("../data/store");

const validateLead = (payload) => {
  const { name, phone, email, interest } = payload;
  if (!name || !phone || !email || !interest) {
    return "Name, phone, email, and interest are required";
  }
  return null;
};

const listLeads = (req, res) => {
  try {
    res.json(store.leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leads" });
  }
};

const getLead = (req, res) => {
  try {
    const lead = store.leads.find((item) => item.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json(lead);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load lead" });
  }
};

const createLead = (req, res) => {
  try {
    const error = validateLead(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const lead = {
      id: createId(),
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      interest: req.body.interest,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    store.leads.push(lead);
    return res.status(201).json(lead);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create lead" });
  }
};

const convertLead = (req, res) => {
  try {
    const lead = store.leads.find((item) => item.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const customer = {
      id: createId(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      notes: `Converted from lead: ${lead.interest}`,
      salesHistory: [],
      createdAt: new Date().toISOString(),
    };

    store.customers.push(customer);
    lead.status = "Converted";

    return res.json({ lead, customer });
  } catch (error) {
    return res.status(500).json({ message: "Failed to convert lead" });
  }
};

const deleteLead = (req, res) => {
  try {
    const index = store.leads.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const [removed] = store.leads.splice(index, 1);
    return res.json({ message: "Lead deleted", lead: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete lead" });
  }
};

module.exports = {
  listLeads,
  getLead,
  createLead,
  convertLead,
  deleteLead,
};
