const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
// in users.js or router file
const { saveRedirectUrl, isLoggedIn } = require('../middleware');



router.get("/signup",(req,res)=>{
    res.render("users/signup");

})

router.post("/signup" ,saveRedirectUrl, wrapAsync(async(req,res)=>{
    try{
 let {username , email , password} = req.body;
 const newUser = new User({email , username});
 let registeredUser= await User.register(newUser , password);
 console.log(registeredUser);
 req.login (function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/login");
    });

    }
catch(error)
{
    req.flash("error",error.message);
    res.redirect("/signup");
}
}))

router.get("/login", (req,res)=>{
     res.render("users/login");
})

router.post('/login',
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Check the password and Username'
  }),
  (req, res) => {
    const redirectUrl = res.locals.redirectUrl || '/listings'; // fallback to /listings
    res.redirect(redirectUrl);
  }
);


router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
         res.redirect('/listings');
        
    });
});


module.exports= router;