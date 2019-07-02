const express = require('express');

const authControllers = require('../controllers/auth');
const isLogged = require('../midware/is-logged');

const router = express.Router();

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', authControllers.postSignup);

module.exports = router;