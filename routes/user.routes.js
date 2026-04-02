import express from "express"

const userRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.middleware.js'

import {
    userRegister,
    otpVerification,
    resendOtp,
    createPassword,
    userLogin,
    userLogout,
    updateAvatar,
    updateCoverImage
  } from '../controller/user.controller.js'

userRouter
         .post('/register', userRegister)
         .post('/otp-verification/:id', otpVerification)
         .post('/resend-otp/:id', resendOtp)
         .post('/create-password/:userId', createPassword)  
         .post('/login', userLogin)
         .post('/logout', verifyJWT, userLogout)
         .patch('/edit-profile/avatar', verifyJWT, upload.single('avatar'), updateAvatar)
         .patch('/edit-profile/coverImage', verifyJWT, upload.single('coverImage'), updateCoverImage)


         
         


export default userRouter   