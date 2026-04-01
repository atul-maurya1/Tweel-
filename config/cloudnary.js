import cloudinary from 'cloudinary'

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
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudinary ", response.url)
        fs.unlinkSync(localFilePath) // remove the locally saved file after successful upload
        return response
    }catch(e){
      fs.unlinkSync(localFilePath) // reomve the locally saved file as the upload operation got failed
      return null
    }
}

// export const deleteFromCloudinary = async (private_path) => {
//     try{
//         if(!private_path) return null
//     }catch(err){
//         console.log('error while deleting from the cloudinary ')
//     }
// }