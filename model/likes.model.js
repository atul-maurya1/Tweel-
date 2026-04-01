import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
      likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
      },
}, {timestamps: true})

const Like = mongoose.model("Like", likeSchema)
export default Like