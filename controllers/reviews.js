const Rent = require('../models/rent');
const Review=require('../models/review')

module.exports.createReview=async (req,res)=>{
         
    const rent = await  Rent.findById(req.params.id);
    const review =new Review(req.body.review);

    review.author=req.user._id;
    rent.reviews.push(review);
    await review.save();
    await rent.save();
    req.flash('success','Successfully posted a review');
    res.redirect(`/rent/${rent._id}`);

}

module.exports.deleteReview=async (req,res )=>{

    const {id,reviewId}=req.params;
    await Rent.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review'); 
    res.redirect(`/rent/${id}`);
}