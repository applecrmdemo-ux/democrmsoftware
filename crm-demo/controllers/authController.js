// Controller for simplified login logic.
const { store } = require("../data/store");

const credentials = {
  admin: { password: "password", role: "admin" },
  salesman: { password: "password", role: "sales" },
  tech: { password: "password", role: "tech" },
  manager: { password: "password", role: "manager" },
};

const login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const record = credentials[username];
    if (!record || record.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    store.activeRoles.add(record.role);
    return res.json({ role: record.role });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  login,
};
