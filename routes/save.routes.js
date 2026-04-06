import express from 'express'

const saveRouter = express.Router()

import {saveTweet} from '../controller/save.controller.js'
import{verifyJWT} from '../middleware/auth.middleware.js'

saveRouter.post('/save-tweet/:id', verifyJWT, saveTweet)


export default saveRouter
