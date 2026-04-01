import mongoose from 'mongoose'

const connectDB = async() => {
    try{
      const connection = await mongoose.connect(process.env.MONGO_URL)
      console.log(`MongoDB is connnected successfully: ${connection.connection.host}`)
    }catch(err){
        console.error("Error while connecting to db: ", err)

    }
}

export default connectDB