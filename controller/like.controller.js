import Like from '../model/likes.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const tweetLikedByUser = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const tweetId = req.params.id

    const likedTweet = await Like.findOne({
        likedBy: userId,
        tweet: tweetId
    })
    
    console.log("like tweet is: ", likedTweet)

    if(likedTweet){
        //unlike
        await Like.findByIdAndDelete(likedTweet._id)
       const totalLike  = await Like.countDocuments({tweet: tweetId})
        return res.status(200)
            .json( new apiResponse(200,  {message: "unlike", isliked: false, totalLike})
      )
    }else{
        //like
        await Like.create({
             likedBy: userId,
             tweet: tweetId
        })
         const totalLike  = await Like.countDocuments({tweet: tweetId})
         return res.status(200)
            .json( new apiResponse(200,  {message: "like", isliked: true, totalLike})
      )
    }

})