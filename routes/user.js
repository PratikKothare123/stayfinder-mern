const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = await new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }
       req.flash("success", "Welcome to StayFinder");
       res.redirect("/listings");
    }); 
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login", saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  async(req, res) => {
    req.flash("success","Wlc back to StayFinder");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // suppose we direct login occuer error Bcz, req dosent to to the isLoggedIn and saveRedirectUrl
    res.redirect(redirectUrl);
  },
);


router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
    if(err){
      return nexr();
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
