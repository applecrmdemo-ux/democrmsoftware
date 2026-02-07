// Controller for appointment scheduling.
const { store, createId } = require("../data/store");

const validateAppointment = (payload) => {
  const { customerName, date, time, purpose } = payload;
  if (!customerName || !date || !time || !purpose) {
    return "Customer name, date, time, and purpose are required";
  }
  return null;
};

const listAppointments = (req, res) => {
  try {
    res.json(store.appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to load appointments" });
  }
};

const getAppointment = (req, res) => {
  try {
    const appointment = store.appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load appointment" });
  }
};

const createAppointment = (req, res) => {
  try {
    const error = validateAppointment(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const appointment = {
      id: createId(),
      customerName: req.body.customerName,
      date: req.body.date,
      time: req.body.time,
      purpose: req.body.purpose,
      createdAt: new Date().toISOString(),
    };

    store.appointments.push(appointment);
    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create appointment" });
  }
};

const deleteAppointment = (req, res) => {
  try {
    const index = store.appointments.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const [removed] = store.appointments.splice(index, 1);
    return res.json({ message: "Appointment deleted", appointment: removed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete appointment" });
  }
};

module.exports = {
  listAppointments,
  getAppointment,
  createAppointment,
  deleteAppointment,
};
