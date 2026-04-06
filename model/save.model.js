import mongoose from 'mongoose'

const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }
}, {timestamps: true})

const Save = mongoose.model("Save", saveSchema)

export default Save