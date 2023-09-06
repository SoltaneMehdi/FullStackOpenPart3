const lodash = require("lodash");

const dummy = (blogs) => {
    return 1;
};
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes;
    }, 0);
};
const favoriteBlog = (blogs) => {
    let fav = blogs[0];
    blogs.forEach((blog) => {
        if (blog.likes > fav.likes) {
            fav = blog;
        }
    });
    return { title: fav.title, author: fav.author, likes: fav.likes };
};
const mostBlogs = (bloglist) => {
    propertyName = "author";
    const count = lodash.countBy(bloglist, propertyName);
    const maxBlogs = lodash.maxBy(
        lodash.entries(count),
        ([key, value]) => value
    );
    return {
        author: maxBlogs[0],
        blogs: maxBlogs[1],
    };
};
const mostLikes = (bloglist) => {
    const groupedList = lodash.groupBy(bloglist, "author");
    const maxLikes = lodash.maxBy(lodash.entries(groupedList), ([key, value]) =>
        totalLikes(value)
    );
    return {
        author: maxLikes[0],
        likes: totalLikes(maxLikes[1]),
    };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
