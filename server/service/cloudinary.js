const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { uid } = require('uid')
const config = require('../../config')
const { Logger, CustomException, Storage: { PRODUCT } } = require('../utils')

Logger.name('Push image and Media to cloudinary')


cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    cloud_api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
})

const tempStorage = './tmp'

const testStorage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, tempStorage)
    },
    filename(req, file, cb){
        cb(null, uid(15))
    }
})

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: PRODUCT,
        transformation: [{ crop: 'scale'}]
    }
})

if (config.DB_NAME === "test") storage = testStorage;

const uploadProductImage = multer({
  storage,

  // file limit is 1mb
  limits: { fileSize: 1024 * 1024 },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
      return cb(new CustomException("file must be an image"));
    }
    return cb(null, true);
  },
});

const deleteProductImage = async (params) => {
    try {
      return await cloudinary.uploader.destroy(params, (error, result) => {
        if (error) return log.info(`An error occured: ${JSON.stringify(result)}`);
        return log.info(`Product Image deleted succesfully ${JSON.stringify(result)}`);
      });
    } catch (err) {
      return log.info(`ERROR in file Deleting : ${JSON.stringify(err)}`);
    }
  };

  module.exports = {
    uploadProductImage,
    deleteProductImage
  }

