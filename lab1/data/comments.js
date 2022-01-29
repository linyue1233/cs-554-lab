const mongoCollections = require("../config/mongoCollections");
const blogs = mongoCollections.blogs;
const blogData = require('./blogs');
let { ObjectId } = require('mongodb');


module.exports = {

    async createComment(blogId, commentContent, userThatPostedComment) {
        if (!this.checkName(commentContent)) {
            throw `Your comment content is invalid`;
        }
        try {
            this.myDBfunction(blogId);
        } catch (e) {
            throw (e.message);
        }
        let singalBlog = await blogData.getBlog(blogId);
        let allComments = singalBlog.comments;
        const newCommentId = new ObjectId();
        userThatPostedComment._id = this.myDBfunction(userThatPostedComment._id);
        let newComment = {
            _id: newCommentId,
            userThatPostedComment:userThatPostedComment,
            comments: commentContent
        };
        allComments.push(newComment);
        const blogsCollection = await blogs();
        const updateCommentInfo = await blogsCollection.updateOne(
            {_id: this.myDBfunction(blogId)},
            {$set:{comments: allComments}}
        );
        if( updateCommentInfo.modifiedCount ===0 ){
            throw 'could not update blog comment successfully';
        }
        return newComment;
    },

    async deletedComment(commentId){
        if (!commentId) throw 'You must provide an id to search for';
        try {
            this.myDBfunction(commentId);
        } catch (e) {
            throw (e.message);
        }
        const blogCollection = await blogs();
        const deletedCommentInfo = await blogCollection.updateOne({ 'comments._id': this.myDBfunction(commentId) }, { $pull: { comments: { _id: this.myDBfunction(commentId) } } });
        if (deletedCommentInfo.modifiedCount == 0) {
            throw 'could not remove comment successfully';
        }
        return "delete successfully";
    },

    async getCommentById(blogId, commentId){
        try {
            this.myDBfunction(blogId);
            this.myDBfunction(commentId);
        } catch (e) {
            throw (e.message);
        }
        const blogCollection = await blogs();
        let commentAns = await blogCollection.find({'comments._id': this.myDBfunction(commentId)}).toArray();
        if (commentAns.length === 0) throw `there is no comment with id: ${commentId}`;
        let comments =  commentAns[0].comments;
        for( let item of comments ) {
            if( commentId === item._id.toString() ){
                item._id = item._id.toString() 
                return item;
            }
        }
        throw `There is maybe an error when searching for a comment`;
    },

    checkName(name) {
        if (Object.prototype.toString.call(name) !== '[object String]') {
            return false;
        }
        name = name.trim();
        if (name === "") {
            return false;
        }
        return true;
    },

    myDBfunction(id) {
        if (!id) throw 'Id parameter must be supplied';
        if (typeof id !== 'string') throw "Id must be a string";
        let parsedId = ObjectId(id);
        return parsedId;
    }
}