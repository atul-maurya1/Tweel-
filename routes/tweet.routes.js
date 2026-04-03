import express from "express"

const tweetRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.middleware.js'

import {
    createTweet,
    editTweet,
    deleteTweet
 } from '../controller/tweet.controller.js'

 tweetRouter
           .post('/create-tweet',
             verifyJWT,
             upload.fields([
            {
             name: 'images',
             maxCount: 2
            },
            {
             name: 'video',
             maxCount: 1
            }
         ]),
             createTweet
        )

tweetRouter.patch('/edit-tweet/:tweetId' , verifyJWT, editTweet)
            .delete('/delete-tweet/:tweetId', verifyJWT, deleteTweet)      
            


           
export default tweetRouter          
