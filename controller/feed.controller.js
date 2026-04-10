import Tweet from '../model/tweet.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Follow from '../model/follow.model.js'

export const followingFeed = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const followingUser = await Follow.find({follower: userId}).select("following")
   // console.log(followingUser)

   const followingIds = followingUser.map (f=>f.following )

   const tweet = await Tweet.find({
      createdBy: followingIds
   }).sort({createdAt: -1})

   console.log(tweet.length)

    if(tweet.length===0){
        throw new apiError(404, 'no tweet found')
    }
   return res.status(200).json(new apiResponse(200, {tweet, message: 'tweet fetched successfully'}))

})


export const feed = asyncHandler(async(req, res) => {
    const tweet = await Tweet.find()
    if(tweet.length===0){
        throw new apiError(404, 'no tweet found')
    }
   return res.status(200).json(new apiResponse(200, {tweet, message: 'tweet fetched successfully'}))

})