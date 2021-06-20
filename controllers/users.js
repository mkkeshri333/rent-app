

const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.Register=async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to yelp Camp!');
        res.redirect('/rent');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
    
    
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}


module.exports.Login=(req,res)=>{
    req.flash('success','welcome back!!!!');
    const redirectUrl=req.session.returnTo ||  '/rent';
    res.redirect(redirectUrl);
 }

 module.exports.Logout=(req,res)=>{
    req.logout('success');
    req.flash('success',"Goodbye!");
    res.redirect('/rent');
}