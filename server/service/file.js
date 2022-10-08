const Cloudinary = require("./cloudinary");

exports.cloudinary = Cloudinary.uploadProductImage.single("image");
exports.deleteCloud = Cloudinary.deleteProductImage;
