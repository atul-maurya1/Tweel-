import apiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try{ 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")  // "Bearer tokenValue" 
        if(!token){
            throw new apiError(401, "Unauthorized request, token missing")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(401, "Unauthorized request, user not found")
        }
  
        req.user = user
        next()

    }catch(e){
          console.error("JWT verification error:", e)
          throw new apiError(401, e?.message || "Unauthorized request, invalid token")
    }
})
 