const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: "dleoy3m0o",
    api_key: "",
    api_secret: ""
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: '3way',
    },
});

module.exports = multer({ storage: storage });