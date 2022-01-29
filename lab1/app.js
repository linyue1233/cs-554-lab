const express = require('express');
const app = express();
const session = require('express-session');
const userRouter = require('./routes');


app.use(express.json());
app.use(session({
    name: 'AuthCookie',
    secret: 'this yue lin alone moment',
    resave: false,
    saveUninitialized: true
}));

userRouter(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});