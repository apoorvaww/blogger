import {v2 as cloudinary} from 'cloudinary' 
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async(localFilePath) => {
    console.log(localFilePath);
    try {
        if(!localFilePath) {
            return;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // console.log(`"response after uploading file to cloudinary: ", response)
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error("cloudinary upload failed: ", error);
        return null;
    }
}

export {uploadOnCloudinary}
