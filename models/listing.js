const mongoose = require('mongoose');
const review = require('./review');
const Review = require('./review.js')
const listingSchema = new mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
    },
    image: {
        filename: String,
        url: {
          type: String,
          set: (v) =>
            v === ""
              ? "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg"
              : v,
          default:
            "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg",
        },
      }
      ,
    price:{
        type:Number
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      },
      
    ],
    owner:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
      },

    
})

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id :{$in: listing.reviews}});
  }

})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;