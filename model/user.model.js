import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        trim:  true,
        lowercase: true
    },
    userName: {
        type: String,
        unique: true,
        required: [true ,'username is required'],
        lowercase: true,
        trim: true,
        index: true  
    },
    email: {
        type:  String,
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address'],
    },
    password: {
        type:String,
       // required: [true, 'password is required'],
        trim: true,
        minlength: [6 ,' minimum 6 char']
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    dob:{
        type: Date
    },
    isVerified: {
         type: Boolean,
         default: false
    },
    about: {
       type: String,
       maxlength: [25, 'maximum 15 chars are allowed']
    },
    avatar:{
        public_url: {type: String},
        private_path: {type: String}
    },
    coverImage: {
        public_url: {type: String},
        private_path: {type: String}
    },
    externalUrl: {
        type: String
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})


userSchema.pre("save", async function(){
      if (!this.isModified("password")) return;
      this.password = await bcrypt.hash(this.password, 10);
      
})

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
        _id: this._id,
        userName: this.userName,
        email: this.email
      },
         process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


const User = mongoose.model("User", userSchema)
export default User