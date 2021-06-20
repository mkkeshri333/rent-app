const mongoose= require('mongoose');
const Review = require('./review')
const User = require('./user')

const Schema=mongoose.Schema;

const RentSchema = new Schema({
    title:String,
    images:[
      {
          url:String,
          filename:String
      }
    ],
    price:Number,
    contact:Number,
    description:String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});


RentSchema.post('findOneAndDelete',async function(doc){

    if(doc){
        await Review.remove({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Rent' ,RentSchema);