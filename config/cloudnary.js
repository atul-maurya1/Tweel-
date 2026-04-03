import { v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

export const cloudinaryConfig = async () => {
   try{
     cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_APT_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    })
   }catch(err){
    console.log('error while cloudinary Config', err)
   }
}

export const  uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "Tweel-images"
        })
        console.log("file is uploaded on cloudinary ", response.url)
        fs.unlinkSync(localFilePath) // remove the locally saved file after successful upload
        return response
    }catch(e){
      fs.unlinkSync(localFilePath) // reomve the locally saved file as the upload operation got failed
      console.error("error while uploding to cloudinary ", e)
      return null
    }
}

export const deleteFromCloudinary = async (public_id , options = {}) => {
    try{
        if(!public_id) return null
        const response = await cloudinary.uploader.destroy(public_id, options)
         return response
    }catch(err){
        console.log('error while deleting from the cloudinary ', err)
    }
} 