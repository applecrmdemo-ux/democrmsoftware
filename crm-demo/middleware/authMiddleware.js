// Lightweight role-based authorization middleware.
const { store } = require("../data/store");

const requireRole = (roles) => (req, res, next) => {
  const role = req.header("x-role");

  if (!role) {
    return res.status(401).json({ message: "Missing role header" });
  }

  if (!store.activeRoles.has(role)) {
    return res.status(401).json({ message: "Role not authenticated" });
  }

  if (!roles.includes(role)) {
    return res.status(403).json({ message: "Insufficient role permissions" });
  }

  req.userRole = role;
  return next();
};

module.exports = {
  requireRole,
};
