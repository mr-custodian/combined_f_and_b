import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



cloudinary.config({
    cloud_name:'dnhqndzo3',
    secure:true,
    api_key:"498979651478316",
    api_secret:"-qUHN6IUtt0JZQCoF3WKWC1bBmQ"

})

const uploadCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        console.log("file is uploaded on clundinary ",response.url);
        return response;
    }catch(err){
        console.log(err)
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadCloudinary};
 