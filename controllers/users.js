const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const regUser = await User.register(newUser, password);
        // console.log(regUser);
        req.login(regUser, (err) => {   //login automatically after signup(passport method)
            if(err){
                return next(err);
            }

            req.flash("success", "Welcome to DreamStay");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
}


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login = (req, res)=>{
    req.flash("success", "Welcome back to DreamStay!");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        
        req.flash("success", "You are logged out!");
        res.redirect("/");
    })
}