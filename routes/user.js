const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = await new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to StayFinder");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  async(req, res) => {
    req.flash("success","Wlc back to StayFinder");
    res.redirect("/listings");
  },
);

module.exports = router;
