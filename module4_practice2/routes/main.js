const express = require('express');
const path = require('path');

const dirRoute = require('../util/path');


const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(dirRoute, 'views', 'main.html'));
})

router.post('/', (req, res, next) => {
    let data = req.body;
    for (let element in data) {
        console.log(data[element]);
    }
        
    res.redirect('/user');
})

module.exports = router;