const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const userRouter = require('./routes/users');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', static);


app.use(session({
    name: 'AuthCookie',
    secret: 'this yue lin alone moment',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/blog', userRouter);
app.use('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});