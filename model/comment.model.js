import mongoose from 'mongoose'


const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Tweet"
    },
    comment: {
        type: String,
        
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment