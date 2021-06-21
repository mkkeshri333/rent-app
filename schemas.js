const Joi = require('joi');

/*
const extension=(joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
      'string.escapeHTML':'{{#label}} must not include HTML'
    },

    rules:{
           escapeHTML:{
               validate(value,helpers){
                   const clean = sanitizeHtml(value,{
                       allowedTags:[],
                       allowedAttributes:{},
                   });

                   if(clean!==value) return helpers.error('string.escapeHTML',{value})
                   return clean;
               }
           }
    }
});


const Joi=BaseJoi.extend(extension);
*/

module.exports.rentSchema = Joi.object({
    rent: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        contact:Joi.number().required(),
       // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()

    }).required()
});

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        body:Joi.string().required()
    }).required()
})