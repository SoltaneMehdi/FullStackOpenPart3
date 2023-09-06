const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
    { title: "it", author: "Stephen King", url: "url1", likes: 1 },
    { title: "dune", author: "Frank Herbert", url: "url1", likes: 1 },
];
const initialUser = {
    username: "the hitman",
    name: "thomas hearns",
    password: "IBeatDuran",
};
const initiateDatabase = async (api) => {
    const response = await api.post("/api/users").send(initialUser);

    const blogs = initialBlogs.map((blog) => ({
        ...blog,
        user: response.body.id,
    }));
    await Blog.insertMany(blogs);
};

const getToken = async (api) => {
    const logedIn = await api.post("/api/login").send({
        username: initialUser.username,
        password: initialUser.password,
    });
    const token = logedIn.body.token;
    return token;
};
const BlogsInDB = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};
const UsersInDB = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());
};
module.exports = {
    initialBlogs,
    initialUser,
    initiateDatabase,
    getToken,
    BlogsInDB,
    UsersInDB,
};
