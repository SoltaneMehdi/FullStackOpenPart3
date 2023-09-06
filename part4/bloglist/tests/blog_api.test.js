const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const { default: mongoose } = require("mongoose");
const blog = require("../models/blog");
const User = require("../models/user");
const { token } = require("morgan");

const api = supertest(app);

describe("blog api tests", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Blog.deleteMany({});

        await helper.initiateDatabase(api);
    });

    test("blogs can be added", async () => {
        const blogsBefore = await helper.BlogsInDB();
        const token = await helper.getToken(api);
        await api
            .post("/api/blogs")
            .send({
                title: "Dune messiah",
                author: "Frank Herbert",
                url: "url1",
                likes: 10,
            })
            .set("authorization", `Bearer ${token}`);
        const blogsAfter = await helper.BlogsInDB();
        expect(blogsAfter).toHaveLength(blogsBefore.length + 1);
        expect(blogsAfter.map((blog) => blog.title)).toContain("Dune messiah");
    });
    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(helper.initialBlogs.length);
    });
    test("responses are in Json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-type", /application\/json/);
    });
    test("blog has property id", async () => {
        const response = await api.get("/api/blogs");
        response.body.forEach((blog) => {
            expect(blog.id).toBeDefined();
        });
    }, 10000);

    test("likes defauts to 0", async () => {
        const token = await helper.getToken(api);
        const response = await api
            .post("/api/blogs")
            .send({
                title: "Twillight",
                author: "Stephanie Meyer",
                url: "url11",
            })
            .set("authorization", `Bearer ${token}`);
        const savedBlog = await Blog.findById(response.body.id);
        expect(savedBlog.likes).toBe(0);
    }, 10000);
    test("deleting a blog", async () => {
        const blogsBefore = await helper.BlogsInDB();
        const blogToDelete = blogsBefore[0];
        const token = await helper.getToken(api);
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("authorization", `Bearer ${token}`);
        const blogsAfter = await helper.BlogsInDB();
        expect(blogsAfter).toHaveLength(blogsBefore.length - 1);
        expect(blogsAfter.map((blog) => blog.id)).not.toContain(
            blogToDelete.id
        );
    }, 10000);
    test("updating a blog", async () => {
        const newBlog = {
            title: "modified title",
        };
        const blogsBefore = await helper.BlogsInDB();
        const blogToUpdate = blogsBefore[0];
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog);
        updatedBlog = await Blog.findById(blogToUpdate.id);
        expect(updatedBlog.title).toBe("modified title");
    });
    afterAll(async () => {
        mongoose.connection.close();
    });
});
