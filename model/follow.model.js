import mongoose from 'mongoose'

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
   following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
   }

},{timestamps: true})

// duplicate follow prevent
followSchema.index({ follower: 1, following: 1 }, { unique: true })

const follow = mongoose.model("follow", followSchema)
export default follow