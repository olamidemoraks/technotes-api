const path = require("path");
const not_found = (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
};

module.exports = not_found;
