import Comment from '../model/comment.model.js'
import apiResponse from '../utils/apiResponse.js'
import apiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import Tweet from '../model/tweet.model.js'

export const userComment = asyncHandler(async(req, res)=> {
    const userId = req.user._id
    const tweetId = req.params.id
    const{comment} = req.body
    if(!comment){
        throw apiError(400, 'please write comment')
    }

    const newComment =  await Comment.create({
          user: userId,
          tweet: tweetId,
          comment: comment
    })
      await Tweet.findByIdAndUpdate(tweetId, {
        $inc: { commentsCount: 1 }
    })


     await newComment.populate("user", "userName avatar")
     return res
          .status(201)
          .json(new apiResponse(201, newComment,  'comment is posted'))

})

export const commentDelete = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const commentId = req.params.id

    const deletedComment = await Comment.findByIdAndDelete(commentId, userId)
    await Tweet.findByIdAndUpdate(deletedComment.tweet, {
        $inc: { commentsCount: -1 }
    })
   
    return res
           .status(200)
           .json(new apiResponse(200 , deletedComment, 'Comment is deleted successfully'))

})