const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

module.exports = {
    async createBlog(title, body, userThatPosted) {
        if (!title || !body || !userThatPosted) {
            throw `You must provide more information about the blog`;
        }
        // check type
        if (Object.prototype.toString.call(title) !== '[object String]') throw `the Title's type is not string`;
        title = title.trim();
        if (title === "") throw `parameter: title's type is whitespace`;

        if (Object.prototype.toString.call(body) !== '[object String]')
            body = body.trim();
        if (body === "") throw `parameter: body's type is whitespace`;

        if (Object.prototype.toString.call(userThatPosted) !== '[object Object]')
            if (!userThatPosted.hasOwnProperty("_id")) {
                throw `it seems that it lacks an attribute: id`;
            }
        if (!userThatPosted.hasOwnProperty("username")) {
            throw `it seems that it lacks an attribute: username`;
        }
        try {
            this.myDBfunction(userThatPosted._id);
        } catch (e) {
            throw (e.message);
        }
        if (Object.prototype.toString.call(userThatPosted.username) !== '[object String]' || userThatPosted.username.trim() === "") {
            throw `your identity info is invalid`;
        }

        let comments = [];
        const blogsList = await blogs();
        let newBlog = {
            title: title,
            body: body,
            userThatPosted: userThatPosted,
            comments: comments
        }

        const addRes = await blogsList.insertOne(newBlog);
        if (addRes.insertedCount === 0) {
            throw 'Could not add a restaurant';
        }
        const newBlogId = addRes.insertedId.toString();
        const blogReturn = await this.getBlog(newBlogId);
        return blogReturn;
    },

    async getBlog(id) {
        if (!id) throw 'You must provide an id to search for';
        this.checkIdIsVaild(id);
        try {
            this.myDBfunction(id);
        } catch (e) {
            throw (e.message);
        }
        const blogCollections = await blogs();
        const oneBlog = await blogCollections.findOne({ _id: this.myDBfunction(id) });
        if (oneBlog === null) {
            throw `no blog with that id`;
        }
        oneBlog._id = oneBlog._id.toString();
        oneBlog.userThatPosted._id = oneBlog.userThatPosted._id.toString();
        return oneBlog;
    },

    async getAll() {
        const allBlogs = await blogs();
        const blogList = await allBlogs.find({}).toArray();
        for (let i = 0; i < blogList.length; ++i) {
            blogList[i]._id = blogList[i]._id.toString();
            blogList[i].userThatPosted._id = blogList[i].userThatPosted._id.toString();
        }
        return blogList;
    },

    async putBlog(blogId, title, body) {
        if (!title || !body) {
            throw `You must provide more information about the blog`;
        }
        try {
            this.myDBfunction(blogId);
        } catch (e) {
            throw (e.message);
        }
        // check type
        if (Object.prototype.toString.call(title) !== '[object String]') throw `the Title's type is not string`;
        title = title.trim();
        if (title === "") throw `parameter: title's type is whitespace`;

        if (Object.prototype.toString.call(body) !== '[object String]')
            body = body.trim();
        if (body === "") throw `parameter: body's type is whitespace`;
        const updateBlog = {
            title: title,
            body: body
        }
        await getBlog(blogId);

        const blogCollection = await blogs();
        const updateInfo = await blogCollection.updateOne(
            { _id: this.myDBfunction(blogId) },
            { $set: updateBlog }
        );
        if (updateInfo.modifiedCount == 0) {
            throw 'could not update blog successfully';
        }

        return await this.getBlog(blogId);
    },

    async patchBlog(blogId, title, body) {
        try {
            this.myDBfunction(blogId);
        } catch (e) {
            throw (e.message);
        }
        if (title === undefined && body === undefined) {
            throw `You should provide a parameter at least`;
        }
        const oldBlogInfo = await getBlog(blogId);
        if (title === undefined || title === null) {
            if (Object.prototype.toString.call(body) !== '[object String]')
                body = body.trim();
            if (body === "") throw `parameter: body's type is whitespace`;
            title = oldBlogInfo.title;
        }
        if (body === undefined || body === null) {
            if (Object.prototype.toString.call(title) !== '[object String]')
            title = title.trim();
            if (title === "") throw `parameter: title's type is whitespace`;
            body = oldBlogInfo.body;
        }

        const updateBlog = {
            title: title,
            body: body
        }
        const blogCollection = await blogs();
        const updateInfo = await blogCollection.updateOne(
            { _id: this.myDBfunction(blogId) },
            { $set: updateBlog }
        );
        if (updateInfo.modifiedCount == 0) {
            throw 'could not update blog successfully';
        }

        return await this.getBlog(blogId);
    },

    myDBfunction(id) {
        if (!id) throw 'Id parameter must be supplied';
        if (typeof id !== 'string') throw "Id must be a string";
        let parsedId = ObjectId(id);
        return parsedId;
    },

    checkIdIsVaild(id) {
        if (id === undefined) throw `you should pass the parameter`;
        if (typeof id !== 'string') throw "Id must be a string";
        id = id.trim();
        if (id === "") {
            throw 'id is whitespace';
        }
    },
}