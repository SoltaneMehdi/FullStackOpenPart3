const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const correctPassword =
        user === null ? false : bcrypt.compare(password, user.passwordHash);

    if (!(user && correctPassword)) {
        return response
            .status(401)
            .json({ error: "invalid username or password" });
    }
    tokenParam = {
        username: user.username,
        id: user._id,
    };
    const token = jwt.sign(tokenParam, process.env.SECRET_KEY);

    response
        .status(200)
        .json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
