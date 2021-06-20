
const { rentSchema } = require('./schemas.js');
const {reviewSchema } =require('./schemas.js');
const Rent = require('./models/rent');
const Review=require('./models/review')
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn=(req,res,next)=>{

if(!req.isAuthenticated()){

    req.session.returnTo=req.originalUrl;
    req.flash('error' , 'you must be signed in ');
    return res.redirect('/login');
}
next();
}


module.exports.validateRent = (req, res, next) => {

    const { error } = rentSchema.validate(req.body)
    //console.log(error);
    if (error) {

        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        res.redirect('/rent/new');
        //throw new ExpressError(msg,400);
    }
    else {
        next();
    }
}


module.exports.isAuthor=async (req,res,next)=>{
     
    const {id} = req.params;
    const rent = await Rent.findById(id)

    if(!rent.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that');
        return res.redirect(`/rent/${id}`);
    }

    next();
};


module.exports.isReviewAuthor=async (req,res,next)=>{
     
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)

    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that');
        return res.redirect(`/rent/${id}`);
    }

    next();
};



module.exports.validateReview = (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
 
    if(error){
         
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else { 
        next();
    }
 };