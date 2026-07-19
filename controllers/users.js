const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("success","Wlc back to StayFinder");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // suppose we direct login occuer error Bcz, req dosent to to the isLoggedIn and saveRedirectUrl
    res.redirect(redirectUrl);
  }

module.exports.logout = (req,res,next)=>{
   req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
}