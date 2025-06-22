const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// CloudinaryStorage expects a single string or a function for `format`, not an array.
// If you want to allow multiple formats, just omit the `format` entirely and let Cloudinary detect it.

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'wanderlust_DEV',
      resource_type: 'image',
     // format: ['jpg','png','jpeg'], // optional, you can enforce one format
      
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
