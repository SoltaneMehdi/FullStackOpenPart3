const userRouter = require("express").Router();
const User = require("../models/user");
bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
    const allUsers = await User.find({}).populate("blogs", {
        title: 1,
        author: 1,
        url: 1,
        likes: 1,
    });
    response.json(allUsers);
});

userRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    if (password.length < 3) {
        return response.status(400).json({ error: "password too short" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        name,
        passwordHash,
    });
    const savedUser = await user.save();
    if (savedUser) {
        response.json(savedUser);
    } else {
        response.status(404).end();
    }
});

module.exports = userRouter;
