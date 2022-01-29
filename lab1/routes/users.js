const userData = require('../data/users');
const blogData = require('../data/blogs');

const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    let skipBlog = req.query.skip;
    let takeBlog = req.query.take;
    let reg = /^[\d]+$/;
    if (skipBlog === undefined && takeBlog === undefined) {
        let allBlogs = await blogData.getAll();
        res.json(allBlogs.splice(0, 20));
        return;
    } else if (skipBlog === undefined && takeBlog !== undefined) {
        if (!reg.test(takeBlog)) {
            res.status(400).json({ error: 'You need to check your url' });
            return;
        }
        let n = parseInt(takeBlog, 10);
        if (n > 100 || n<0) {
            res.status(400).json({ error: 'take must be from 0 to 100' });
            return;
        }
        let allBlogs = await blogData.getAll();
        res.json(allBlogs.splice(0, n));
        return;
    } else if (skipBlog !== undefined && takeBlog === undefined) {
        if (!reg.test(skipBlog)) {
            res.status(400).json({ error: 'You need to check your url' });
            return;
        }
        let n = parseInt(skipBlog, 10);
        if (n<0) {
            res.status(400).json({ error: 'skip must be positive' });
            return;
        }
        let allBlogs = await blogData.getAll();
        res.json(allBlogs.splice(n, n + 20));
        return;
    } else {
        if (!reg.test(skipBlog) || !reg.test(takeBlog)) {
            return 'You need to check your url';
        }
        let n1 = parseInt(skipBlog, 10);
        let n2 = parseInt(takeBlog, 10);
        if (n1<0 || n2 > 100 || n2<0) {
            res.status(400).json({ error: 'skip must be positive and take must be from 0 to 100' });
            return;
        }
        let allBlogs = await blogData.getAll();
        res.json(allBlogs.splice(n1, n1 + n2));
        return;
    }
});

router.get("/:id", async (req, res) => {
    let blogId = req.params.id;
    blogId = blogId.trim();
    if (blogId === "") {
        res.status(400).json({ error: 'You need to check your url' });
        return;
    }
    try {
        let signleBlog = await blogData.getBlog(blogId);
        res.json(signleBlog);
        return;
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/",async (req, res)=>{
    if(!req.session.user){
        res.status(403).json({ error: "You must login firstly" });
        return;
    }
    let blogInfo = req.body;
    if(!blogInfo){
        res.status(400).json({ error: "You must provide data for a blog" });
        return;
    }
    let title = blogInfo.title;
    let body = blogInfo.body;
    if(!title){
        res.status(400).json({ error: 'You must provide a title for the blog' });
        return;
    }
    if(!body){
        res.status(400).json({ error: 'You must provide the content for the blog' });
        return;
    }

    if (Object.prototype.toString.call(title) !== '[object String]') {
        res.status(400).json({ error: "parameter: title's type is not string" });
        return;
    }
    title = title.trim();
    if( title ===""){
        res.status(400).json({ error: "parameter: title's is whitespace" });
        return;
    }
    if (Object.prototype.toString.call(title) !== '[object String]') {
        res.status(400).json({ error: "parameter: title's type is not string" });
        return;
    }
    body = body.trim();
    if( body ===""){
        res.status(400).json({ error: "parameter: body's is whitespace" });
        return;
    }

    try{
        let userInfo = {
            _id: req.session._id,
            username: req.session.username
        }
        const newBlog = await blogData.createBlog(title,body,userInfo);
        res.status(200).json(newBlog);
    }catch (e) {
        res.sendStatus(500);
        return;
    }
})

router.put("/:id",async(req, res)=>{
    if(!req.session.user){
        res.status(403).json({ error: "You must login firstly" });
        return;
    }
    try {
        myDBfunction(req.params.id);
    } catch (e) {
        res.status(400).json({ error: 'the blogId is not valid' });
        return;
    }
    let curUser = req.session.user;
    let blogInfo = req.body;
    if(!blogInfo){
        res.status(400).json({ error: "You must provide data for a blog" });
        return;
    }
    let title = blogInfo.title;
    let body = blogInfo.body;
    if(blogInfo.comments !== null) {
        res.status(400).json({ error: 'you can not change the comment' });
        return;
    }
    if(!title){
        res.status(400).json({ error: 'You must provide a title for the blog' });
        return;
    }
    if(!body){
        res.status(400).json({ error: 'You must provide the content for the blog' });
        return;
    }

    if (Object.prototype.toString.call(title) !== '[object String]') {
        res.status(400).json({ error: "parameter: title's type is not string" });
        return;
    }
    title = title.trim();
    if( title ===""){
        res.status(400).json({ error: "parameter: title's is whitespace" });
        return;
    }
    if (Object.prototype.toString.call(title) !== '[object String]') {
        res.status(400).json({ error: "parameter: title's type is not string" });
        return;
    }
    body = body.trim();
    if( body ===""){
        res.status(400).json({ error: "parameter: body's is whitespace" });
        return;
    }

    let oldBlogInfo;
    try{
        oldBlogInfo = await blogData.getBlog(req.params.id);
    }catch (e) {
        res.status(404).json({error:e});
    }
    try{
        let blogOwner = await userData.getUserById(oldBlogInfo.userThatPosted._id);
        if(curUser._id !== blogOwner._id){
            res.status(403).json({error:"A user has to be logged in to update a blog post AND they must be the same user who originally posted the blog post"})
            return;
        }
        const updateBlog = await blogData.putBlog(req.params.id,title,body);
        res.status(200).json(updateBlog);
        return;
    }catch(e){
        res.status(500).json({error:e});
    }
})

router.patch("/:id", async (req, res)=>{
    if(!req.session.user){
        res.status(403).json({ error: "You must login firstly" });
        return;
    }
    try {
        myDBfunction(req.params.id);
    } catch (e) {
        res.status(400).json({ error: 'the blogId is not valid' });
        return;
    }
    let curUser = req.session.user;
    let blogInfo = req.body;
    if(!blogInfo){
        res.status(400).json({ error: "You must provide data for a blog" });
        return;
    }
    let title = blogInfo.title;
    let body = blogInfo.body;
    if(blogInfo.comments !== null) {
        res.status(400).json({ error: 'you can not change the comment' });
        return;
    }
    if( (title === null && body === null)  || (title === undefined && body === undefined)    ){
        res.status(400).json({ error: "You must provide params at least for blog" });
        return;
    }
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

    let oldBlogInfo;
    try{
        oldBlogInfo = await blogData.getBlog(req.params.id);
    }catch (e) {
        res.status(404).json({error:e});
    }
    try{
        let blogOwner = await userData.getUserById(oldBlogInfo.userThatPosted._id);
        if(curUser._id !== blogOwner._id){
            res.status(403).json({error:"A user has to be logged in to update a blog post AND they must be the same user who originally posted the blog post"})
            return;
        }
        const updateBlog = await blogData.patchBlog(req.params.id,title,body);
        res.status(200).json(updateBlog);
        return;
    }catch(e){
        res.status(500).json({error:e});
    }
})

router.post("/:id/comments",async(req,res) => {
    if(!req.session.user){
        res.status(403).json({ error: "You must login firstly" });
        return;
    }
})


router.post("/signup", async (req, res) => {
    if (!req.body.name || !req.body.username || !req.body.password) {
        res.status(400).json({ error: 'You should provide all information' });
        return;
    }
    const { name, username, password } = req.body;
    if (name.trim() === "" || username.trim() === "" || password.trim() === "") {
        res.status(400).json({ error: 'You should provide all valid information' });
        return;
    }
    if (!checkName(name)) {
        res.status(400).json({ error: 'your name is invalid' });
        return;
    }
    if (!checkName(username)) {
        res.status(400).json({ error: 'your username is invalid' });
        return;
    }
    if (!checkName(password)) {
        res.status(400).json({ error: 'your password is invalid' });
        return;
    }
    try {
        let addedBlog = await userData.createUser(name, username, password);
        res.json(addedBlog);
        return;
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error_message: "You should provide all information" });
        return;
    }
    const { username, password } = req.body;
    if (username.trim() === "" || password.trim() === "") {
        res.status(400).json({ error_message: "You should provide all information" });
        return;
    }

    if (!checkName(username)) {
        res.status(400).json({ error_message: "your username is invalid" });
        return;
    }
    if (!checkName(password)) {
        res.status(400).json({ error_message: "your password is invalid" });
        return;
    }

    try {
        let { authenticated } = await userData.checkUser(username, password);
        if (authenticated === true) {
            let userInfo = await userData.getUserByUsername(username);
            req.session.cookie.name = 'AuthCookie';
            req.session.user = userInfo;
            res.json(userInfo);
            return;
        } else {
            res.status(400).json({ error: 'You did not provide a valid username and/or password' });
            return;
        }
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }
});

router.get("/logout", async (req, res) => {
    if (req.session.user) {
        res.clearCookie("AuthCookie");
        req.session.saveUninitialized = false;
        req.session.destroy();
        res.status(200).json({ Notification: "You have logout successfully" });
        return;
    } else {
        res.sendStatus(403).json({ Notification: "Acess Forbidde"});
        return;
    }
})

function checkName(name) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
        return false;
    }
    name = name.trim();
    if (name === "") {
        return false;
    }
    return true;
}

function myDBfunction(id) {
    if (!id) throw 'Id parameter must be supplied';
    if (typeof id !== 'string') throw "Id must be a string";
    let parsedId = ObjectId(id);
    return parsedId;
};

module.exports = router;