const express = require("express");
const { check, body } = require("express-validator/check");

const User = require("../models/user");
const bcrypt = require("bcryptjs");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getLogin);

router.post(
  "/login",
  [
    check("email", "Invalid email.")
      .isEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ where: { email: value } });
        if (!user) {
          return Promise.reject("Invalid email or passowrd.");
        }
      })
      .normalizeEmail(),
    body("password", "Invalid email or password.")
      .trim()
      .isLength({ min: 5 })
      .custom(async (value, { req }) => {
        const user = await User.findOne({ where: { email: req.body.email } });
        const result = await bcrypt.compare(value, user.password);
        if (!result) {
          return Promise.reject("Invalid email or password.");
        }
      })
  ],
  authControllers.postLogin
);

router.post("/logout", authControllers.postLogout);

router.get("/signup", authControllers.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("You entered invalid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject("Such user already exists!");
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "You entered invalid password. It must contain at least 7 characters."
    )
      .trim()
      .isLength({ min: 5 }),
    body("confirmPassword", "Passwords must match.")
      .trim()
      .custom((value, { req }) => value === req.body.password)
  ],
  authControllers.postSignup
);

router.get("/reset", authControllers.getResetPass);

router.post("/reset", authControllers.postReset);

router.get("/reset/:resetToken", authControllers.getNewPass);

router.post("/new-pass", authControllers.postNewPass);

module.exports = router;
