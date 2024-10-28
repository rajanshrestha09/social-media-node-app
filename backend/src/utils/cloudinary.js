import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

async function uploadOnCloudinary(localProfileImagePath) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  const uploadResult = await cloudinary.uploader
    .upload(localProfileImagePath, {
      resource_type: "auto"
    })
    .catch((error) => {
      fs.unlinkSync(localProfileImagePath)      
      console.log(`Error in cloudinary:: ${error}`);
      return null

    })
  fs.unlinkSync(localProfileImagePath)
  // console.log(`UploadResult:: `, uploadResult);
  
  return uploadResult

}

export default uploadOnCloudinary