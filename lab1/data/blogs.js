const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

module.exports = {
    async createBlog(title,body,userThatPosted){
        if( !title || !body || !userThatPosted ){
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
        if( !userThatPosted.hasOwnProperty("_id") ){
            throw `it seems that it lacks an attribute: id`;
        }
        if( !userThatPosted.hasOwnProperty("username") ){
            throw `it seems that it lacks an attribute: username`;
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

    async getBlog(id){
        if(!id) throw 'You must provide an id to search for';
        this.checkIdIsVaild(id);
        try {
            this.myDBfunction(id);
        } catch (e) {
            throw (e.message);
        }
        const blogCollections = await blogs();
        const oneBlog = await blogCollections.findOne({_id: this.myDBfunction(id)});
        if( oneBlog === null ) {
            throw `no blog with that id`;
        }
        oneBlog._id = oneBlog._id.toString();
        return oneBlog;
    },

    async getAll(){
        const allBlogs = await blogs();
        const blogList = await allBlogs.find({}).toArray();
        for (let i = 0; i < blogList.length; ++i) {
            blogList[i]._id = blogList[i]._id.toString();
        }
        return blogList;
    },

    async putBlog(){
        
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