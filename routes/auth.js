const express = require('express');
const { check, body } = require('express-validator/check');

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const authControllers = require('../controllers/auth');

const router = express.Router();

router.get('/login', authControllers.getLogin);

router.post('/login', [
    check('email', 'Invalid email.')
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ where: { email: value } })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Invalid email or passowrd.')
                    }
                })
        })
        .normalizeEmail(),
    body('password', 'Invalid email or password.')
        .trim()
        .isLength({ min: 5 })
        .custom((value, { req }) => {
            return User.findOne({ where: { email: req.body.email } })
                .then(user => {
                    return bcrypt.compare(value, user.password)
                })
                .then(result => {
                    if (!result) {
                        return Promise.reject('Invalid email or password.')
                    }
                })
        })
], authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);


router.post('/signup', [check('email')
    .isEmail()
    .withMessage('You entered invalid email.')
    .custom((value, { req }) => {
        return User.findOne({ where: { email: value } })
            .then(user => {
                if (user) {
                    return Promise.reject('Such user already exists!')
                }
            })
    })
    .normalizeEmail(),
body('password', 'You entered invalid password. It must contain at least 7 characters.')
    .trim()
    .isLength({ min: 5 }),
body('confirmPassword', 'Passwords must match.')
    .trim()
    .custom((value, { req }) => value === req.body.password)],
    authControllers.postSignup);

router.get('/reset', authControllers.getResetPass);

router.post('/reset', authControllers.postReset);

router.get('/reset/:resetToken', authControllers.getNewPass);

router.post('/new-pass', authControllers.postNewPass);

module.exports = router;