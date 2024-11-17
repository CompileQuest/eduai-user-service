const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const winston = require("winston");

// Initialize Express
const app = express();

// Setup middleware
app.use(express.json());
app.use(cors());

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // Set log level (info, debug, error, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    // Console transport - logs will appear in the console
    new winston.transports.Console({ format: winston.format.simple() }),

    // File transport - logs will be written to a file
    new winston.transports.File({ filename: 'request_logs.log' })
  ],
});

// Middleware to log incoming requests using Winston
app.use((req, res, next) => {
  // Log the incoming request details
  logger.info(`Incoming request: ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Setup proxies for different routes
app.use("/user", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8002"));
app.use("/", proxy("http://localhost:8003"));

// Start the server
app.listen(8000, () => {
  logger.info("Gateway is listening on port 8000");
});
