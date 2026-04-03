import User from '../model/user.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import {uploadOnCloudinary} from '../config/cloudnary.js'
import {deleteFromCloudinary} from '../config/cloudnary.js'
import Tweet from '../model/tweet .model.js'

export const createTweet = asyncHandler(async(req, res) => {
    const userName = req.user.userName
    console.log(userName)
    const{title} = req.body
    if(!title){
        throw new apiError(400, 'write tweet')
    }

    const cloudinaryImageUrls = await Promise.all( // Promise.all runs all upload promises in parallel and returns an array of results after all uploads are completed
    req.files.images.map(file => {
    const filePath = file.path; 
    console.log("file path: ", filePath)
    return uploadOnCloudinary(filePath);
   })
  );
 // Cloudinary ek file upload karta hai, lekin Promise.all se tum ek hi time pe multiple upload requests bhej sakte ho


    const localVideoFilePath = req.files?.video[0].path  // local file 
    console.log(localVideoFilePath)
    const cloudinaryVideoUrl = await uploadOnCloudinary(localVideoFilePath)  
        

    if(!cloudinaryImageUrls || !cloudinaryVideoUrl){
        throw new apiError(400, 'error while uplading image and video on cloudinary')
    }

    const images = cloudinaryImageUrls.map(img => ({
    url: img.url,
    public_id: img.public_id
   }))

    const video = {
        public_id: cloudinaryVideoUrl.public_id,
        url: cloudinaryVideoUrl.url
    }
 
    const createTweet = await Tweet.create({
        createdBy: req.user._id,
        title,
        images,
        video
    })

    res.status(200).json(
        new apiResponse(200, createTweet, "tweet is created")
    )

})


export const editTweet = asyncHandler( async (req, res) => {
    const tweetId = req.params.tweetId
    const {title} = req.body
    const tweet = await Tweet.findByIdAndUpdate(tweetId, {
        title: title
    },{new: true})

    return res
           .status(200)
           .json( new apiResponse(200, 'tweet update successfully'))

})

export const deleteTweet = asyncHandler( async (req, res) => {
    const tweetId = req.params.tweetId

    const tweet = await Tweet.findByIdAndDelete(tweetId)
   
     if(tweet.images.length > 0){
       const cloudinaryImageUrls = await Promise.all( 
        tweet.images.map(file => {
            const public_id = file.public_id
            console.log("public id: ", public_id)
             return  deleteFromCloudinary(public_id)
              
        }) 
       )
     console.log("deleteImages", cloudinaryImageUrls)  
    }

    console.log(tweet.video)
    if(tweet.video){
       const public_id = tweet?.video?.public_id
       console.log("video id: ", tweet.video.public_id )
       try{
        const deleteVideo = await deleteFromCloudinary(public_id, {
         resource_type: "video",
       })
        console.log("deleteVideo", deleteVideo)
       }catch(e){
        console.log("error while deleting video: ", e)
       }
      
    }
 
    return res
           .status(200)
           .json(new apiResponse(200, 'tweet deleted'))

})