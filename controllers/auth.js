const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    res.render('auth/login', {
        pageName: 'Login',
        path: "/login",
        csrfToken: req.csrfToken(),
        logError: req.flash('error')
    })
}

exports.postLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password!');
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    else {
                        req.flash('error', 'Invalid email or password!');
                        res.redirect('/login');
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
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
        userError: req.flash('userError'),
        emailError: req.flash('emailError'),
        passError: req.flash('passError'),
        passMatchError: req.flash('passMatchError')
    })
}

exports.postSignup = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    }
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                req.flash('userError', 'Such user already exists!');
                return res.redirect('/signup');
            }
            if (!email) {
                req.flash('emailError', 'Email required!');
                return res.redirect('signup');
            }
            if (!password) {
                req.flash('passError', 'Password required!');
                return res.redirect('/signup');
            }
            if (password !== confirmPassword) {
                req.flash('passMatchError', 'Passwords must match!');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPw => {
                    User.create({
                        email: email,
                        password: hashedPw
                    })
                    return Promise.resolve();
                })
                .then(result => {
                    res.redirect('/login');
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}