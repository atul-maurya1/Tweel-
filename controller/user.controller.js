import User from '../model/user.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import generateOTP from '../utils/otpGenerate.js'
import tempUser from '../model/tempUser.model.js'
import jwt from 'jsonwebtoken'
import {sendMail} from '../utils/sendMail.js'
import {uploadOnCloudinary} from '../config/cloudnary.js'
import {deleteFromCloudinary} from '../config/cloudnary.js'


export const gnerateaccessTokenAndRefreshToken = async (userId) => {
    try{

        const user = await User.findById(userId)
      
        const accessToken =  await user.generateAccessToken()
        const refreshToken  = await user.generateRefreshToken()
        // console.log("refresh token: ", refreshToken )

        user.refreshToken = refreshToken
        await user.save()
        return {accessToken, refreshToken}

    }catch(e){
        console.error("error while generating access token and refresh token: ", e)
         throw new apiError(500, "Failed to generate tokens")
    }
}


export const userRegister = asyncHandler(async(req, res)=> {
  const {firstName, lastName, email, userName, dob} = req.body
  if([firstName, email, userName].some(field => field?.trim()==="")){
    throw new apiError(400, "all fields are required")
  }

  const isExistsUserName = await User.findOne({userName: userName})
  if(isExistsUserName){
    throw new apiError(400, "username is already exists")
  }

  const birthDate = new Date(dob);
  const today = new Date();
  
   if(birthDate > today){
      throw new apiError(400, "please enter valid dob")
    }

    const ageLimit = new Date();
    ageLimit.setFullYear(ageLimit.getFullYear() - 18);
    if(birthDate > ageLimit){
        throw new apiError(400, 'age must be 18 years old')
    }

    const otp = generateOTP()
   // console.log("otp is: ", otp)
   const tempuser = await tempUser.create({
    firstName,
    lastName,
    email,
    userName,
    dob,
    otp: otp,
    otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
   })

   const message = `<div style="font-family: Arial, sans-serif; padding:20px;">
                    <h2>Tweel - Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="letter-spacing:5px;">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p>Thanks,<br/>Tweel Team</p>
                    </div>`

   await sendMail(tempuser.email, "OTP Verification - Tweel", message) 
   
   return res.
   status(201).
   json(new apiResponse(201, tempuser, "otp send successfully"))
    
})


export const otpVerification = asyncHandler(async(req, res)=> {
    const id = req.params.id
    const {otp} = req.body
    if(!otp){
        throw new apiError(400, 'please enter otp')
    }

    const tempuser = await tempUser.findById({_id: id})
    if(!tempuser){
        throw new apiError(400, 'something went wrong')
    }

    if(otp.toString()!==tempuser.otp.toString()){
        throw new apiError(400, 'Invalid otp')
    }
    if(otp.otpExpiry < Date.now){
        throw new apiError(400, 'otp expired')
    }

    const user = await User.create({
        firstName: tempuser.firstName,
        lastName: tempuser.lastName,
        email: tempuser.email,
        userName: tempuser.userName,
        dob: tempuser.dob,
        isVerified: true
    })

    await tempUser.findByIdAndDelete(id)

    return res
           .status(201)
           .json(new apiResponse(201, user, "user register and verified successfully"))

})


export const resendOtp = asyncHandler(async(req, res) => {
    const id = req.params.id
    if(!id){
        throw new apiError(400, 'something went wrong id missing')
    }
    const tempuser = await tempUser.findById({_id: id})
    if(!tempuser){
        throw new apiError(400, 'registeration failed plaese try again ||  failed plaese try again')
    }

    const otp = generateOTP()
    tempuser.otp = otp
    tempuser.otpExpiry = Date.now() + 5 * 60 * 1000, // 5 minutes
    await tempuser.save()

    const message = `<div style="font-family: Arial, sans-serif; padding:20px;">
                    <h2>Tweel - Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="letter-spacing:5px;">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p>Thanks,<br/>Tweel Team</p>
                    </div>`

   await sendMail(tempuser.email, "OTP Verification - Tweel", message) 

   return res
          .status(200)
          .json(new apiResponse(200, tempuser, 're-send otp seccussfully'))
})


export const createPassword = asyncHandler(async(req, res) => {
    const userId = req.params.userId
    if(!userId){
        throw new apiError(400, 'user id is missing')
    }
    const{password, confirmPassword} = req.body
    if(!password || !confirmPassword){
        throw new apiError(400, 'all fields are required')
    }
    if(password !== confirmPassword){
        throw new apiError(400, 'password and confirmPassword is not same')
    }

    const user = await User.findById(userId)
    if(user.password){
        throw new apiError(400, 'password is already created please login ')
    }
    user.password = password
    await user.save()

    const {accessToken, refreshToken} = await gnerateaccessTokenAndRefreshToken(user._id)
    const logginUser = await User.findById(user._id).select("-password -refreshToken")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new apiResponse(200, {user: logginUser, accessToken, refreshToken}, 'password is created and loggin user')
      )

}) 

export const userLogin =  asyncHandler(async(req, res) => {
    const {userName, password} = req.body
    if(!userName || !password){
        throw new apiError(400, 'all fields are required')
    }

    const isUserExits = await User.findOne({userName: userName})
    if(!isUserExits){
        throw new apiError(404, "User not exits")
    }

    const isPasswordValid = await isUserExits.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await gnerateaccessTokenAndRefreshToken(isUserExits._id)
    const loginUser = await User.findById(isUserExits._id).select("-password -refreshToken")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res
           .status(200)
           .cookie("refreshToken", refreshToken, cookieOptions)
           .cookie("accessToken", accessToken, cookieOptions)
           .json(new apiResponse(200, {user: loginUser, accessToken, refreshToken }, 'user login successfully'))
          
 
})
   

export const userLogout = asyncHandler(async(req, res) => {
        const userId = req.user._id
        const user = await User.findByIdAndUpdate(userId, {
           refreshToken: null
        }, {new: true})

        if(!user){
            throw new apiError(404, 'user not found')
        }

       const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        return res
               .status(200)
               .clearCookie('refreshToken', cookieOptions)
               .clearCookie('accessToken', cookieOptions)
               .json(new apiResponse(200, 'user logout successfully'))           
})


export const refreshAccessToken = asyncHandler(async(req, res) => {
    try{
       const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
       if(!incomingRefreshToken){
         throw new apiError(400, 'Unauthorized request')
       }

       const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
       const user = await User.findById(decodedToken._id)
       if(!user){
         throw new apiError(401, "Invalid refresh token")
       }

       if(incomingRefreshToken !== user?.refreshToken){
         throw new apiError(401, 'Refresh token is expire or used')
       }

       const options = {
         httpOnly: true,
         secure:  true
       }

       const {accessToken, refreshToken} = await gnerateaccessTokenAndRefreshToken(user._id)
       
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshTokem", refreshToken , options)
       .json( 
         new apiResponse (
            200, 
            {accessToken, refreshToken: refreshToken},
            "Access token refreshed"
         )
       )

    }catch(e){
        throw new apiError(500, e?.message || "Invalid refresh token")
    }
})


export const updateAvatar = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const avatarLocalPath = req.file?.path
    console.log("file is :" , avatarLocalPath)
    if(!avatarLocalPath){
        throw new apiError(400, 'please select file')
    }
    const cloudinaryFile = await uploadOnCloudinary(avatarLocalPath)
    if(!cloudinaryFile){
        throw new apiError(404, 'cloundinary File not found')
    }

    const user = await User.findById(userId)
   
    const avatar = {
        public_id: cloudinaryFile.public_id,
        url: cloudinaryFile.url
    }
  
    const updateduser = await User.findByIdAndUpdate(userId, {
        $set: {avatar}
    }, {new: true}).select("-password  -refreshToken")

  const isdelete = await deleteFromCloudinary(user.avatar.public_id)
  console.log(isdelete)
  return res
          .status(200)
          .json(new apiResponse(200, updateduser, 'profile avatar updated successfully'))
})
  

export const updateCoverImage = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const coverImageLocalPath = req.file?.path
    console.log("file is :" , coverImageLocalPath)
    if(!coverImageLocalPath){
        throw new apiError(400, 'please select file')
    }
    const cloudinaryFile = await uploadOnCloudinary(coverImageLocalPath)
    if(!cloudinaryFile){
        throw new apiError(404, 'cloundinary File not found')
    }

    const user = await User.findById(userId)
   
    const coverImage = {
        public_id: cloudinaryFile.public_id,
        url: cloudinaryFile.url
    }
  
    const updateduser = await User.findByIdAndUpdate(userId, {
        $set: {coverImage}
    }, {new: true}).select("-password  -refreshToken")

  const isdelete = await deleteFromCloudinary(user.coverImage.public_id)
  console.log(isdelete)
  return res
          .status(200)
          .json(new apiResponse(200, updateduser, 'profile avatar updated successfully'))

})


export const userEditProfile = asyncHandler(async(req, res) => {
    const userId = req.user._id   
    if(!userId){
        throw new apiError(400, 'userId is missing, user not found')
    }
    const {firstName, lastName, userName, about, externalUrl, gender} = req.body
    
    const isUserNameExists = await User.findOne({userName: userName})
    if(isUserNameExists){
        throw new apiError(400, 'Username is already exists')
    }

    const user = await User.findByIdAndUpdate(userId, {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        about: about,
        externalUrl: externalUrl,
        gender: gender
    }, {new: true}).select("-password -refreshToekn")

    return res
           .status(200)
           .json(new apiResponse(200, user, "user details update successfully"))
})


// own profile
export const getProfile = asyncHandler(async(req, res)=>{
    const userName = req.params.userName
    if(!userName){
        throw new apiError(400, "user not exists")
    }
})

export const changePassword = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const {oldPassword, newPassword, confirmNewPassword} = req.body
    if(!oldPassword || !newPassword || !confirmNewPassword){
     throw new apiError(400, 'all fields are required')
    }
    if(newPassword !== confirmNewPassword){
      throw new apiError(400, "password and confirmPassword is not matched")
    }
    const user = await User.findById(userId)

    if(! await user.isPasswordCorrect(oldPassword)){
        throw new apiError(400, "old password is wrong")
    }

    user.password = newPassword
    await user.save()

    const cookieOptions = {
            httpOnly: true,
            secure: true
     }

    return res
           .status(200)
           .clearCookie('refreshToken', cookieOptions)
           .clearCookie('accessToken', cookieOptions)
           .json(new apiResponse(200, 'password change successfully'))

})

 export const forgotPassword = asyncHandler(async(req, res) => {
//     const{userName} = req.body
//     if(!userName){
//         throw new apiError(400, 'userName is required')
//     }

//     const user = await User.findOne({userName: userName})
//     if(!user){
//         throw new apiError(404, 'user not found')
//     }
//     const otp = generateOTP()
//     const tempuser = await tempUser.create({
//         userName: userName,
//         email: user.email,
//         otp,
//        otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
//     })

//     const message = `<div style="font-family: Arial, sans-serif; padding:20px;">
//                     <h2>Tweel - OTP Verification</h2>
//                     <p><strong>Dear, ${userName} </strong></p><br><br>
//                     <p>Your OTP for  Forgot Password is:</p>
//                     <h1 style="letter-spacing:5px;">${otp}</h1>
//                     <p>This OTP is valid for 5 minutes.</p>
//                     <p>If you did not request this, please ignore this email.</p>
//                     <br/>
//                     <p>Thanks,<br/>Tweel Team</p>
//                     </div>`

//     const mail = sendMail(user.email, 'Forgot Password OTP - Tweel', message)

 })



//setting => personal info, edit like email
// setting => change password and forgotPassword{when login}

// own prfile
// user profile => user/userName/tweet
// user profile => user/userName/likedBy
// user prfile => user/userName/media
// user profile => user/userName/comments
// user profile => followers and following {count and list}
//

// someones profile
// follwers, following, username name, avt, coverImg, tweet, media, comments