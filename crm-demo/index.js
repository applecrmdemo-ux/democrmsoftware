// Entry point that starts the Express server.
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CRM demo server running on port ${PORT}`);
});
