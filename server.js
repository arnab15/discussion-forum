const express = require("express");
require("dotenv").config();
const { logger } = require("./logger");
require("./connects/connectDb")();
const mainRouter = require("./routes/index");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        message: "Welcome to the discussion API",
    });
});
app.use("/api", mainRouter);

app.use((req, res, next) => {
    res.send({
        error: {
            statusCode: 404,
            message: "Invalid route",
        },
    });
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
});
