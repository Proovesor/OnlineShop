const express = require('express');
const path = require('path');

const dirRoute = require('../util/path');


const router = express.Router();

router.get('/user', (req, res, next) => {
    res.sendFile(path.join(dirRoute, 'views', 'user.html'));
})

module.exports = router;