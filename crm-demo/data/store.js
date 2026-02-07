// In-memory data store for demo purposes.
const { randomUUID } = require("crypto");

const store = {
  activeRoles: new Set(),
  customers: [],
  products: [],
  sales: [],
  services: [],
  leads: [],
  appointments: [],
};

const createId = () => randomUUID();

module.exports = {
  store,
  createId,
};
