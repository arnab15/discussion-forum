const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, errors, colorize, simple } = format;

function buildDevLogger() {
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });

    return createLogger({
        level: "debug",
        format: combine(
            format.colorize(),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            errors({ stack: true }),
            logFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: "log/error.log",
                level: "error",
            }),
        ],
        exceptionHandlers: [
            new transports.Console({
                format: combine(colorize(), simple()),
            }),
            new transports.File({ filename: "log/exceptions.log" }),
        ],
        rejectionHandlers: [
            new transports.Console({
                format: combine(colorize(), simple()),
            }),
            new transports.File({ filename: "log/rejections.log" }),
        ],
    });
}

module.exports = buildDevLogger;
