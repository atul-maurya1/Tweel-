import User from '../model/user.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import Follow from '../model/follow.model.js'

export const toggleFollow  = asyncHandler(async(req, res) => {
    // follwerId =>  login user
  //  followingId =>  jesko login user follow karega
    const followerId = req.user._id
    const followingId = req.params.id

    if(followerId.toString()=== followingId){
        throw new apiError (400, 'You can not follow itself')
    }

    const exits = await Follow.findOne({
        follower: followerId,
        following: followingId
    })

    if(exits){
        //  UNFOLLOW
            await Follow.findByIdAndDelete(exits._id)

            return res.status(200)
            .json( new apiResponse(200, {message: "unfollowed", isFollowing: false})
      )
          
    }else{
        await Follow.create({
            follower: followerId,
            following: followingId
        }) 
        return res.status(200)
            .json( new apiResponse(200, {message: "followed", isFollowing: true})
      )
    }

})

export const checkIsFollowing = async (req, res) => {
    const followerId = req.user._id
    const followingId = req.params.id

    const exists = await Follow.findOne({
        follower: followerId,
        following: followingId
    })

    res.json({
        isFollowing: !!exists   // return boolean
    })
}
         

//followers list
export const getUserFollowersList = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const list = await Follow.find({following: userId})
     .populate("follower", "firstName lastName userName avatar _id")
     
     console.log("follower is: ", list)

    if(list.length===0){
        throw new apiError(404, 'No Followers find')
    }
   
   return res
           .status(200)
           .json(new apiResponse(200, list, 'follower list is fetched successfully'))


})


// following list
export const getUserFollowingList = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const list = await Follow.find({follower: userId})
    .populate("following", "firstName lastName userName avatar _id")
    console.log("list is: ", list)
  
    if(list.length===0){
        throw new apiError(404, 'No following')
    }

    return res
           .status(200)
           .json(new apiResponse(200, list, 'following list is fetched successfully'))

})