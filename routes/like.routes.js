import express from "express"

const likeRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'

import {tweetLikedByUser} from '../controller/like.controller.js'

likeRouter.post('/like-tweet/:id', verifyJWT, tweetLikedByUser)


export default likeRouter