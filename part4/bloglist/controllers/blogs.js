const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/milddleware");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", {
        username: 1,
        name: 1,
    });
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
    const body = request.body;

    const user = request.user;

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
    });
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();

    response.json(savedBlog);
});

blogsRouter.delete(
    "/:id",
    middleware.userExtractor,
    async (request, response) => {
        const id = request.params.id;
        const blog = await Blog.findById(id);

        const userId = request.user.id;
        if (!userId.toString() === blog.user.toString()) {
            return response.status(401).json({ error: "wrong token" });
        }
        await Blog.findByIdAndRemove(blog.id);
        response.status(204).end();
    }
);
blogsRouter.put("/:id", async (request, response) => {
    const id = request.params.id;
    const body = request.body;
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    };
    const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {
        new: true,
    });
    response.json(updatedBlog);
});

module.exports = blogsRouter;
