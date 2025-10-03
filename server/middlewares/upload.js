// middleware/upload.js
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({}); // keep file in memory/temp
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req,file,cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(['.png','.jpg','.jpeg'].includes(ext)) cb(null,true);
    else cb(new Error('Only images'));
  }
});

const cloudinary = require('../config/cloudinary');
const fs = require('fs');

async function uploadToCloudinary(filePath, folder='app') {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  // remove temp file
  try { fs.unlinkSync(filePath); } catch(e) {}
  return result;
}

module.exports = { upload, uploadToCloudinary };
