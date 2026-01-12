import { v2 as cloudinary } from 'cloudinary';

// Hardcode 'dismkznnn' if the env var is incorrect (common mistake with CBM)
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

console.log('Cloudinary est connecté au nom de :', cloudName);

export default cloudinary;
