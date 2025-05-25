import winston from 'winston';

// Create a logger instance with specific settings
const logger = winston.createLogger({
    level: 'info', // Set the default logging level
    format: winston.format.combine(
        winston.format.timestamp(), // Add a timestamp to each log
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`; // Define the log message format
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
        new winston.transports.File({ filename: 'logs/combined.log' }) // Log all messages to a combined file
    ],
});

// Export the logger for use in other parts of the application
export default logger;