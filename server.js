import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import {cloudinaryConfig} from './config/cloudnary.js'

dotenv.config()

cloudinaryConfig().then( () => {
    console.log('cloudinary Config successfully')
}).catch((err) => {
    console.error("cloudinary Config failed: ", err)
})


connectDB()
.then( () => {
    app.listen(process.env.PORT || 5000 , () => {
    console.log(`server is running at ${process.env.PORT}`)
 })  
}).catch((err) => {
    console.error("mongodb connection failed: ", err)
})
