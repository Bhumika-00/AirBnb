const User = require('../models/user')
const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.signupFirst = (req,res)=>{
    res.render("users/signup");

}

module.exports.signup = async(req,res)=>{
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
}

module.exports.loginFirst = (req,res)=>{
     res.render("users/login");
}

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || '/listings'; // fallback to /listings
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
         res.redirect('/listings');
        
    });
}