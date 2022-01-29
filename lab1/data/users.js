const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 8;


module.exports = {
    async createUser(name, username, password) {
        if (!name || !username || !password) {
            throw `you should provide enough information`;
        }
        if (!this.checkName(name)) {
            throw `your name is invalid`;
        }
        if (!this.checkName(username)) {
            throw `your username is invalid`;
        }
        if (!this.checkName(password)) {
            throw `your password is invalid`;
        }
        //check dumplite username
        const allUsers = await users();
        const usersList = await allUsers.find({}).toArray();
        const lowerUserName = username.toLowerCase();

        for (let item of usersList) {
            let tempUserName = item.username.toLowerCase();
            if (tempUserName === lowerUserName) {
                return { userInserted: false };
            }
        }

        const hash = await bcrypt.hash(password, saltRounds);
        let newUser = {
            name: name,
            username: lowerUserName,
            password: hash
        }
        const addRes = await allUsers.insertOne(newUser);
        if (addRes.insertedCount === 0) {
            throw `can not add a new user`;
        }
        const newBlogId = addRes.insertedId.toString();
        const addedBlog = await this.getBlog(newBlogId);
        return addedBlog;
    },

    async checkUser(username, password) {
        if (!username || !password) {
            throw `you should provide enough information`;
        }
        if (!this.checkName(username)) {
            throw `your username is invalid`;
        }
        if (!this.checkName(password)) {
            throw `your password is invalid`;
        }
        const allUsers = await users();
        const usersList = await allUsers.find({}).toArray();
        const lowerName = username.toLowerCase();
        let compareUser = false;
        for (let item of usersList) {
            let tempUserName = item.username.toLocaleLowerCase();
            if (tempUserName === lowerName) {
                compareUser = await bcrypt.compare(password, item.password);
                if (compareUser) {
                    return { authenticated: true };
                } else {
                    return { authenticated: false };
                    // throw `Either the username or password is invalid`;
                }
            }
        }
        return { authenticated: false };

    },

    async getUserById(id){
        if (!id) throw 'You must provide an id to search for';
        if (id === undefined) throw `you should pass the parameter`;
        if (typeof id !== 'string') throw "Id must be a string";
        id = id.trim();
        if (id === "") {
            throw 'id is whitespace';
        }
        try {
            this.myDBfunction(id);
        } catch (e) {
            throw (e.message);
        }
        const userCollections = await users();
        const oneUser = await userCollections.findOne({ _id: this.myDBfunction(id) });
        if (oneUser === null) {
            throw `no user with that id`;
        }
        oneUser._id = oneUser._id.toString();
        return oneUser;
    },

    async getUserByUsername(username) {
        if (!username) throw 'You must provide a username to search for';
        const allUsers = await users();
        const usersList = await allUsers.find({}).toArray();
        const lowerName = username.toLowerCase();
        for (let item of usersList) {
            let tempUserName = item.username;
            let temp = tempUserName.toLocaleLowerCase();
            if (temp === lowerName) {
                item._id = item._id.toString();
                return item;
            }
        }
        throw `There is no same username in database`;
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