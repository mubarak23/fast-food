const Express = require('express')
const User  = require('../models/user')
const {  Helper,
Logger,
ErrorCode,
ErrorMessage,
CustomException } = require('../utils')
let { Jwt } = require('../service')

Jwt = new Jwt('mubarak23pass123') // process.env.SECRET

const log = new Logger('User controller')

/**
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const userRegister = async function (req, res, next) {
    const { body } = req
    log.info('Register a User', body)
    if(!('name' in body) || !('email' in body) && ('password' in body)){
        res.status(422)
        return next(
            new CustomException(
              ErrorMessage.REQUIRED_EMAIL_PASSWORD,
              ErrorCode.REQUIRED_EMAIL_PASSWORD
            )
        )
    }
  
    const { email, name, phone, password } = body
    let user = await User.findOne({ email });
    if(user){
        res.status(422)
        return next(
            new CustomException(
              // eslint-disable-next-line new-cap
              ErrorMessage.EMAIL_IN_USE(email),
              ErrorCode.EMAIL_IN_USE
            )
          );
    }
    user = new User({
        name,
        email,
        phone
    })
    user.setPassword(password)
    await user.save()
    const token = Jwt.signToken(Helper.tokenPayload(user))
    const data = Helper.formatUser(user, token)
    return res.json({ data })
}

/**
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */

const userLogin = async function (req, res, next) {
    const { body } = req
    log.info('User Login ', body)
    console.log(body)
    if(!('email' in body) || !('password' in body)){
        res.status(422)
        return next(
            new CustomException(
              ErrorMessage.REQUIRED_EMAIL_PASSWORD,
              ErrorCode.REQUIRED_EMAIL_PASSWORD
            )
          );
    }
    const {email, password } = body
    return User.findOne({ email })
    .then((user) => {
        if(!(user != null && user.email != null)){
            res.status(422)
            return next(
                new CustomException(
                  ErrorMessage.ACCOUNT_NOT_FOUND,
                  ErrorCode.ACCOUNT_NOT_FOUND
                )
              );
        }
      if(!user.validatePassword(password)){
        res.status(422)
        return next(
            new CustomException(
              ErrorMessage.INCORRECT_PASSWORD,
              ErrorCode.INCORRECT_PASSWORD
            )
          );
      }  

      if(!user.isActive){
        res.status(422)
        return next(
            new CustomException(
              ErrorMessage.ACCOUNT_DEACTIVATED,
              ErrorCode.ACCOUNT_DEACTIVATED
            )
          );
      }
      const token = Jwt.signToken(Helper.tokenPayload(user))
      const data = Helper.formatUser(user, token)
      return res.json({ data })
    }).catch((err) => {
        log.info(`error ${err}`);
        return next(
          new CustomException(ErrorMessage.UNKNOWN, ErrorCode.UNKNOWN)
        );
      });

}

module.exports = { userRegister, userLogin}