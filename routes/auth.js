const express = require('express');
const { check } = require('express-validator/check');

const authControllers = require('../controllers/auth');

const router = express.Router();

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', [check('email').isEmail().withMessage('You entered invalid email.'),
check('password').trim().isLength({ min: 7 }).withMessage('You entered invalid password.'),
check('confirmPassword').trim().custom((value, { req }) => value === req.body.password).withMessage('Passwords must match.')],
    authControllers.postSignup);

router.get('/reset', authControllers.getResetPass);

router.post('/reset', authControllers.postReset);

router.get('/reset/:resetToken', authControllers.getNewPass);

router.post('/new-pass', authControllers.postNewPass);

module.exports = router;