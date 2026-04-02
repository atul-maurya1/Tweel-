import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const tempUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'password is required'],
        trim: true,
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type:String,
        required: [true, 'password is required'],
        trim: true,
        minlength: [6 ,' minimum 6 char']
    },
    userName: {
        type: String,
        required: [true ,'username is required'],
        lowercase: true,
        trim: true,
        index: true  
    },
     otp:{
        type: Number,
        required: [true, 'OTP is required'],
     },
     dob: {
        type: Date,
        //required: true
     },

    //  otpCreatedAt: Date.,
      otpExpiry:  Date,

     createdAt: {
     type: Date,
     default: Date.now,
  }

})

const tempUser = mongoose.model("tempUser", tempUserSchema)
export default tempUser