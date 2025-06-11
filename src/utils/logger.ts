import winston from 'winston';

// 彩色格式
const colorFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);

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
        new winston.transports.Console({ format: colorFormat }), // Log to the console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }), // Log errors to a file
        new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat }) // Log all messages to a combined file
    ],
});

// Export the logger for use in other parts of the application
export default logger;