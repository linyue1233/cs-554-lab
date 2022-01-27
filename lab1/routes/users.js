const userData = require('../data/users');
const express = require('express');
const router = express.Router();

router.get("/signup", async (req, res) => {
    if (!req.session.user) {
        res.render('signupForm', {
            layout: 'main',
            document_title: "User Signup"
        });
        return;
    } else {
        res.redirect('/');
    }
});

router.post("/signup", async (req, res) => {
    if( !req.body.name || !req.body.username || !req.body.password){
        res.status(400).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "You should provide all information"
        });
        return;
    }
    const { name,username, password } = req.body;
    if (name.trim() === "" ||username.trim() === "" || password.trim() === "") {
        res.status(400).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "You should provide right information"
        });
        return;
    }
    if (!checkName(name)) {
        res.status(400).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "your username is invalid"
        });
        return;
    }
    if (!checkName(username)) {
        res.status(400).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "your username is invalid"
        });
        return;
    }
    if (!checkName(password)) {
        res.status(400).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "your password is invalid"
        });
        return;
    }

    try {
        let { userInserted } = await userData.createUser(name,username, password);
        if (userInserted) {
            res.status(200).redirect("/");
        } else {
            res.status(400).render("signupForm", {
                layout: 'main',
                document_title: "User Signup",
                error_message: "This username exists"
            });
            return;
        }
    } catch (e) {
        res.status(500).render("signupForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "Internal Server Error"
        });
        return;
    }
});

router.post("/login", async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).render("loginForm", {
            layout: 'main',
            document_title: "User Signup",
            error_message: "You should provide all information"
        });
        return;
    }
    const { username, password } = req.body;
    if (username.trim() === "" || password.trim() === "") {
        res.status(400).render("loginForm", {
            layout: 'main',
            document_title: "User Login",
            error_message: "You should enter all information"
        });
        return;
    }

    if (!checkName(username)) {
        res.status(400).render("loginForm", {
            layout: 'main',
            document_title: "User Login",
            error_message: "your username is invalid"
        });
        return;
    }
    if (!checkName(password)) {
        res.status(400).render("loginForm", {
            layout: 'main',
            document_title: "User Login",
            error_message: "your password is invalid"
        });
        return;
    }

    try {
        let { authenticated } = await userData.checkUser(username, password);
        if (authenticated === true) {
            let userName = await userData.getUserByUsername(username);
            req.session.user = userName;
            res.redirect('/private');
        } else {
            res.status(400).render("loginForm", {
                layout: 'main',
                document_title: "User Login",
                error_message: "You did not provide a valid username and/or password"
            });
            return;
        }
    } catch (e) {
        res.status(400).render("loginForm", {
            layout: 'main',
            document_title: "User Login",
            error_message: e
        });
        return;
    }
});

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

module.exports = router;