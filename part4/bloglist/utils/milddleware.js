const logger = require("./logger");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
    ].join(" ");
});

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    } else request.token = null;
    next();
};
const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET_KEY);
    if (!decodedToken) {
        return response.status(401).json({ error: "invalid token" });
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
        return response.status(401).json({ error: "invalid user" });
    }
    request.user = user;
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).json({ error: "malformed id" });
    }
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === "JsonWebTokenError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler,
};
