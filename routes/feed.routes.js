
import express from 'express'
import {verifyJWT} from '../middleware/auth.middleware.js'
import {followingFeed, feed} from '../controller/feed.controller.js'

const feedRouter = express.Router()

feedRouter
         .get('/following-feed', verifyJWT, followingFeed)
         .get('/feed',verifyJWT, feed)
          


export default feedRouter