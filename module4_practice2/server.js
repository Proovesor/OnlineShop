const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

const server = express();

server.use(bodyParser.urlencoded({extended: false}));

server.use(mainRoutes);

server.use(userRoutes);

server.use('/', (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

server.listen(3000);