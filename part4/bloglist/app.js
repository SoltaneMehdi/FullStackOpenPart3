const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./utils/logger");
const config = require("./utils/config");

require("express-async-errors");

const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const userRouter = require("./controllers/users");

const middleware = require("./utils/milddleware");

mongoose
    .connect(config.mongoUrl)
    .then(() => logger.info("connected to mongodb"))
    .catch((error) => logger.error("failed to connect to mongodb: ", error));

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
