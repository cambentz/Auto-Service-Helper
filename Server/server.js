const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const guideRouter = require('./routes/guideRoutes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/guides', guideRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
