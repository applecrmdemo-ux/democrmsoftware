// Controller for service and repair management.
const { store, createId } = require("../data/store");

const validateService = (payload) => {
  const { customerId, deviceName, serialNumber, issueDescription } = payload;
  if (!customerId || !deviceName || !serialNumber || !issueDescription) {
    return "Customer ID, device name, serial number, and issue description are required";
  }
  return null;
};

const listServices = (req, res) => {
  try {
    res.json(store.services);
  } catch (error) {
    res.status(500).json({ message: "Failed to load service tickets" });
  }
};

const getService = (req, res) => {
  try {
    const service = store.services.find((item) => item.id === req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service ticket not found" });
    }
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load service ticket" });
  }
};

const registerService = (req, res) => {
  try {
    const error = validateService(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const customer = store.customers.find((item) => item.id === req.body.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const service = {
      id: createId(),
      customerId: customer.id,
      deviceName: req.body.deviceName,
      serialNumber: req.body.serialNumber,
      issueDescription: req.body.issueDescription,
      status: "Pending",
      technician: req.body.technician || "Unassigned",
      technicianNotes: req.body.technicianNotes || "",
      createdAt: new Date().toISOString(),
    };

    store.services.push(service);
    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ message: "Failed to register service ticket" });
  }
};

const updateService = (req, res) => {
  try {
    const service = store.services.find((item) => item.id === req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service ticket not found" });
    }

    const { status, technician, technicianNotes } = req.body;
    if (status && !["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    service.status = status || service.status;
    service.technician = technician || service.technician;
    service.technicianNotes = technicianNotes !== undefined ? technicianNotes : service.technicianNotes;

    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update service ticket" });
  }
};

const deleteService = (req, res) => {
  try {
    const index = store.services.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Service ticket not found" });
    }

    const [removed] = store.services.splice(index, 1);
    return res.json({ message: "Service ticket deleted", service: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete service ticket" });
  }
};

module.exports = {
  listServices,
  getService,
  registerService,
  updateService,
  deleteService,
};
