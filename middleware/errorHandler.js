const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}\t${err.message}\t ${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );

  console.log(err.stack);

  const status = err.statusCode ? err.statusCode : 500;
  if (err.name === "CastError") {
    res.status(404);

    res.json({ message: "No item found with id:" + err.value });
  }
  res.status(status);

  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
