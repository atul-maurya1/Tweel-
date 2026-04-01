import mongoose from 'mongoose'

const tweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        mexlength: 50,

    } ,
    image: {
       public_url: {type: String},
        private_path: {type: String}
    },
    video: {
        public_url: {type: String},
        private_path: {type: String}
    },

}, {timestamps: true})


const Tweet = mongoose.model("Tweet", tweetSchema)

export default Tweet