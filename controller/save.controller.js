import Save from '../model/save.model.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import Tweet from '../model/tweet.model.js'


export const saveTweet = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const tweetId = req.params.id

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }
    const isSaved = await Save.findOne({tweet: tweetId, user: userId})
    if(isSaved){
        await Save.findByIdAndDelete(isSaved._id)
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: {saveCount: -1},
            //$max: { saveCount: 0 }  // prevents negative
        })
        return res
               .status(200)
               .json(new apiResponse(200, {message: "unsaved", isSave: false}))
    }else{
        await Save.create({
            user: userId, 
            tweet: tweetId
        })
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: {saveCount: 1}
        })
         return res
               .status(200)
               .json(new apiResponse(200, {message: "saved", isSave: true}))
    }

})