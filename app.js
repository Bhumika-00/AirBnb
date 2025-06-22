if(process.env.NODE_ENV != "production")
{
  require('dotenv').config();
 
}

const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const wrapAsync = require('./utils/wrapAsync.js');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User = require("./models/user.js");




app.use(session({
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
})

// app.use("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email:"abc@gmail.com",
//     username:"apnastudent",

//   });
//  let registeredUser= await User.register(fakeUser , "hello");
//  res.send(registeredUser);
// })

// Models
const Listing = require('./models/listing.js');

// Routes
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const usersRouter = require('./routes/user.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// DB connection
main()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.get("/", (req, res) => {
  res.send("App is working");
});

// Sample test route
app.get("/testListing", async (req, res) => {
  const sample = new Listing({
    title: "Luxury Beachside Villa",
    description: "A stunning villa with ocean views, private pool, and modern amenities.",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    price: 450000,
    location: "Malibu, California",
    country: "USA"
  });
  await sample.save();
  res.send("saved");
});

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
 
app.get("/testUpload", (req, res) => {
  res.render("testUpload");
});


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
