import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.json())
// app.use(express.static())


import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import followRouter from './routes/follow.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'

app.use('/api/v1/user', userRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/follow', followRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentRouter)


export default app