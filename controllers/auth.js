const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const { validationResult } = require('express-validator/check');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));


exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }

    res.render('auth/login', {
        pageName: 'Login',
        path: '/login',
        logError: null,
        successfulChange: req.flash('successfulChange'),
        errorField: null,
        userInput: { email: '', password: '' }
    })
}

exports.postLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageName: 'Login',
            path: '/login',
            logError: errors.array()[0].msg,
            successfulChange: req.flash('successfulChange'),
            errorField: errors.array()[0].param,
            userInput: { email: email, password: password }
        })
    }

    User.findOne({ where: { email: email } })
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignup = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    res.render('auth/signup', {
        pageName: 'Signup',
        path: "/signup",
        signupError: null,
        userError: req.flash('userError'),
        errorField: null,
        userInput: { email: '', password: '', confirmPassword: '' }
    })
}

exports.postSignup = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('auth/signup', {
            pageName: 'Signup',
            path: "/signup",
            signupError: errors.array()[0].msg,
            errorField: errors.array()[0].param,
            userInput: { email: email, password: password, confirmPassword: req.body.confirmPassword }
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPw => {
            User.create({
                email: email,
                password: hashedPw
            })
            return Promise.resolve();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'onlineShop@nodeShop.com',
                subject: "You've signed up successfully!",
                html: "<h1 align='center'>You've registered successfully!</h1><br><h1 align='center'>I'm so glad that you're here!</h1>"
            })
        })
        .catch(err => console.log(err))
}

exports.getResetPass = (req, res, next) => {
    res.render('auth/resetPass', {
        pageName: 'Reset Password',
        path: "/resetPass",
        resetError: req.flash('resetError')
    })
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');

        User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    req.flash('resetError', 'No such user exists.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 360000;
                user.save();
            })
            .then(result => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'onlineShop@nodeShop.com',
                    subject: "Password reset.",
                    html: `
                        <p>You wished to reset your password.</p>
                        <p>Follow this <a href="http://localhost:3000/reset/${token}">link</a> to change your password.</p>
                    `
                })
            })
            .catch(err => console.log(err))
    });
}

exports.getNewPass = (req, res, next) => {
    const token = req.params.resetToken;
    User.findOne({ where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } })
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            res.render('auth/newPass', {
                pageName: 'New Password',
                path: "/newPass",
                passMatchError: req.flash('passMatchError'),
                passError: req.flash('passError'),
                userId: user._id,
                resetToken: token
            })
        })
        .catch(err => console.log(err));
}

exports.postNewPass = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.resetToken;
    let currentUser;

    if (!password) {
        req.flash('passError', 'Password required!');
        return res.redirect(`/reset/${token}`);
    }
    if (password !== confirmPassword) {
        req.flash('passMatchError', 'Passwords must match!');
        return res.redirect(`/reset/${token}`);
    }

    User.findOne({ where: { _id: userId, resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } })
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            currentUser = user;
            return bcrypt.hash(password, 12);
        })
        .then(hashedPw => {
            currentUser.password = hashedPw;
            currentUser.resetToken = null;
            currentUser.resetTokenExpiration = null;
            currentUser.save();
            req.flash('successfulChange', 'Your password has been changed successfully, you can sign in now!');
            return res.redirect('/login');
        })
        .catch(err => console.log(err))
}