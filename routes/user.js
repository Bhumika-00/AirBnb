const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const UserController = require('../controllers/user')

router
.route("/signup")
.get(UserController.signupFirst)
.post(saveRedirectUrl, wrapAsync(UserController.signup))

router
.route("/login")
.get( UserController.loginFirst)
.post(saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Check the password and Username'
  }),
  UserController.login
);





router.get("/logout", UserController.logout);


module.exports= router;