import express from "express"

const userRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'

import {
    userRegister,
    otpVerification,
    resendOtp,
    createPassword,
    userLogin,
    userLogout
  } from '../controller/user.controller.js'

userRouter
         .post('/register', userRegister)
         .post('/otp-verification/:id', otpVerification)
         .post('/resend-otp/:id', resendOtp)
         .post('/create-password/:userId', createPassword)  //*
         .post('/login', userLogin)
         .post('/logout', verifyJWT, userLogout)

         
         


export default userRouter   