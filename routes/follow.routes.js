import express from "express"

const followRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'

import {toggleFollow, checkIsFollowing, getUserFollowingList, getUserFollowersList } from '../controller/follow.controller.js'

followRouter
           .post('/follow/:id', verifyJWT, toggleFollow )
           .get('/is-following/:id', verifyJWT, checkIsFollowing)
           .get('/following-list' , verifyJWT, getUserFollowingList)
           .get('/follower-list', verifyJWT, getUserFollowersList)

export default followRouter