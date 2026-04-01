import express from "express"

const userRouter = express.Router()

import {userRegister} from '../controller/user.controller.js'

userRouter
         .get('/register', userRegister)
         


export default userRouter