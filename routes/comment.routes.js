import express from 'express'

const commentRouter = express.Router()

import {userComment, commentDelete} from '../controller/comment.controller.js'

import {verifyJWT} from '../middleware/auth.middleware.js'

commentRouter
             .post('/comment/:id', verifyJWT, userComment)
             .delete('/delete-comment/:id', verifyJWT, commentDelete)
             .getComment

export default commentRouter