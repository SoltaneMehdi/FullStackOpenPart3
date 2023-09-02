const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose
    .connect(mongoUrl)
    .then(() => console.log("connected to mongodb"))
    .catch((error) => console.log("failed to connect to mongodb: ", error));

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    });
});

app.get("/api/blogs/:id", (request, response) => {
    Blog.findById(request.params.id).then((blog) => {
        response.json(blog);
    });
});

app.post("/api/blogs", (request, response) => {
    const blog = new Blog(request.body);

    blog.save().then((result) => {
        response.status(201).json(result);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
