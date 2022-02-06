const express = require('express');
const app = express();
const peopleRouter = require('./router/people')

app.use("/api/people", peopleRouter);
app.use('*', async (req, res) => {
    res.status(404).json({ error: 'There are no apis for you!' });
});


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});