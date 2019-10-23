const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");

const { validationResult } = require("express-validator");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
  }

  res.render("auth/login", {
    pageName: "Login",
    path: "/login",
    logError: null,
    successfulChange: req.flash("successfulChange"),
    userInput: { email: "", password: "" }
  });
};

exports.postLogin = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
  }
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageName: "Login",
      path: "/login",
      logError: errors.array()[0].msg,
      successfulChange: req.flash("successfulChange"),
      userInput: { email: email, password: password }
    });
  }

  try {
    const user = await User.findOne({ where: { email: email } });

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      console.log(err);
      return res.redirect("/");
    });
  } catch (err) {
    console.log(err.statusCode);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
  }
  res.render("auth/signup", {
    pageName: "Signup",
    path: "/signup",
    signupError: null,
    userError: req.flash("userError"),
    errorField: null,
    userInput: { email: "", password: "", confirmPassword: "" }
  });
};

exports.postSignup = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
  }
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      pageName: "Signup",
      path: "/signup",
      signupError: errors.array()[0].msg,
      errorField: errors.array()[0].param,
      userInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      }
    });
  }

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    await User.create({
      email: email,
      password: hashedPw
    });

    res.redirect("/login");
    return transporter.sendMail({
      to: email,
      from: "onlineShop@nodeShop.com",
      subject: "You've signed up successfully!",
      html:
        "<h1 align='center'>You've registered successfully!</h1><br><h1 align='center'>I'm so glad that you're here!</h1>"
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getResetPass = (req, res, next) => {
  res.render("auth/resetPass", {
    pageName: "Reset Password",
    path: "/resetPass",
    resetError: req.flash("resetError")
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    try {
      const token = buffer.toString("hex");
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        req.flash("resetError", "No such user exists.");
        return res.redirect("/reset");
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 360000;
      await user.save();

      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "onlineShop@nodeShop.com",
        subject: "Password reset.",
        html: `
                    <p>You wished to reset your password.</p>
                    <p>Follow this <a href="http://localhost:3000/reset/${token}">link</a> to change your password.</p>
                `
      });
    } catch (e) {
      console.log(e);
    }
  });
};

exports.getNewPass = async (req, res, next) => {
  try {
    const token = req.params.resetToken;
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.redirect("/");
    }
    return res.render("auth/newPass", {
      pageName: "New Password",
      path: "/newPass",
      passMatchError: req.flash("passMatchError"),
      passError: req.flash("passError"),
      userId: user._id,
      resetToken: token
    });
  } catch (e) {
    console.log(e);
  }
};

exports.postNewPass = async (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const token = req.body.resetToken;

  if (!password) {
    req.flash("passError", "Password required!");
    return res.redirect(`/reset/${token}`);
  }
  if (password !== confirmPassword) {
    req.flash("passMatchError", "Passwords must match!");
    return res.redirect(`/reset/${token}`);
  }

  try {
    const user = await User.findOne({
      where: {
        _id: userId,
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() }
      }
    });
    if (!user) {
      return res.redirect("/");
    }

    const hashedPw = await bcrypt.hash(password, 12);
    user.password = hashedPw;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.flash(
      "successfulChange",
      "Your password has been changed successfully, you can sign in now!"
    );
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
  }
};
