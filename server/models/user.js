const mongoose = require('mongoose')
const crypto = require('crypto')
const {
  Constants,
} = require("../utils");


const Schema = mongoose.Schema

const UserSchema = new Schema ({
    email: {
        type: "String",
        required: true,
      },
      hash: String,
      salt: String,
      accountType: {
        type: String,
        default: Constants.USER,
        enum: [Constants.USER, Constants.ADMIN],
      },
      imageUrl: String,
      name: {
        type: "String",
        required: true,
      },
      phone: String,
      isActive: {
        type: Boolean,
        default: true,
      },
      updatedAt: {
        type: Number,
        default: Date.now(),
      },
      createdAt: {
        type: Number,
        default: Date.now(),
      },
})

const updateDate = function (next) {
    this.updatedAt = Date.now();
    next();
  };
  
  UserSchema.pre("save", updateDate)
    .pre("update", updateDate)
    .pre("findOneAndUpdate", updateDate)
    .pre("findByIdAndUpdate", updateDate);

UserSchema.methods.setPassword = function (password){
    this.salt = crypto.randomBytes(24).toString(Constants.ENCODE)
    this.hash = crypto.pbkdf2Sync(password, this.salt, Constants.ITERATION,
         Constants.KEYLENGTH, Constants.DIGEST).toString(Constants.ENCODE)
}    

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, Constants.ITERATION,
        Constants.KEYLENGTH, Constants.DIGEST)
      .toString(Constants.ENCODE);
    return this.hash === hash;
  };


  module.exports = mongoose.model("user", UserSchema)