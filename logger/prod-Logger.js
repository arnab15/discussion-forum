const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json } = format;
const winston = require("winston");
require("winston-daily-rotate-file");

var infoRotateLogger = new winston.transports.DailyRotateFile({
    filename: "log/application-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});

var errorRotateLogger = new winston.transports.DailyRotateFile({
    level: "error",
    filename: "log/application-error-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});

function buildProdLogger() {
    return createLogger({
        level: "info",
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: "user-service" },
        transports: [
            new transports.Console(),
            new transports.File({
                filename: "log/error.log",
                level: "error",
            }),
            infoRotateLogger,
            errorRotateLogger,
        ],
        exceptionHandlers: [new transports.File({ filename: "log/exceptions.log" })],
        rejectionHandlers: [new transports.File({ filename: "log/rejections.log" })],
    });
}

module.exports = buildProdLogger;
