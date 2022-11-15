const rateLimit = require("express-rate-limit");
const { logEvent } = require("./logger");

const loginLimiter = rateLimit({
  window: 60 * 1000,
  max: 5,
  message: {
    message:
      "To many login attempt for this IP, please try again after 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
