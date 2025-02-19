const express = require('express');
const app = express();
const port = 3000;

const usersRouter = require('./routes/users.js');

app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});