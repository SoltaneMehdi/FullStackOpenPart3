const helper = require("./tests/test_helper");
const config = require("./utils/config");
const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://mehdi:iH0Pyys4TzIgLZDX@cluster0.jn4vc1m.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(async () => {
        console.log("connected");
        const allBlogs = await helper.BlogsInDB();
        console.log(allBlogs);
        mongoose.connection.close();
    });
