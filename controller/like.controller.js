import Like from '../model/likes.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import Tweet from '../model/tweet.model.js'

export const tweetLikedByUser = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const tweetId = req.params.id

    const likedTweet = await Like.findOne({
        likedBy: userId,
        tweet: tweetId
    })
    
    

    if(likedTweet){
        //unlike
        await Like.findByIdAndDelete(likedTweet._id)

        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: {likesCount: -1}
        })

        return res.status(200)
            .json( new apiResponse(200,  {message: "unlike", isliked: false})
      )
    }else{
        //like
        await Like.create({
             likedBy: userId,
             tweet: tweetId
        })
          await Tweet.findByIdAndUpdate(tweetId, {
            $inc: {likesCount: 1}
        })
         return res.status(200)
            .json( new apiResponse(200,  {message: "like", isliked: true})
      )
    }

})