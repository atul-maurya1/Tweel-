import mongoose from 'mongoose'

const tweetSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        mexlength: 50,
    } ,
    images:[
        {
            public_id: {type: String},
            url: {type: String}
        }
    ],
    video: {
        public_id: {type: String},
        url: {type: String}
    },

}, {timestamps: true})


const Tweet = mongoose.model("Tweet", tweetSchema)

export default Tweet