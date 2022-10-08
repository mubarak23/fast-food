const Express = require('express')
const { User } = require('../models/user')
const {  Helper: { formatUser, tokenPayload, validateBody },
Logger,
ErrorCodes,
ErrorMessage,
CustomException } = require('../utils')
let { Jwt } = require('../service')

Jwt = new Jwt(process.env.SECRET)

const log = new Logger('User controller')

/**
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const registerUser = async function (req, res, next) {
    const { body } = req
    log.info('Register', body)
    if(!('name' in body) || !('email' in body) && ('password' in body)){
        res.statusCode(422)
        return next(
            new CustomException(
              ErrorMessage.REQUIRED_EMAIL_PASSWORD,
              ErrorCodes.REQUIRED_EMAIL_PASSWORD
            )
        )
    }
    const isValid = validateBody(
        ['phone', 'email', 'password', 'name'],
        body,
        res,
        next
    )
    if(!isValid) return false
    const { email, name, phone, password } = body
    let user = await User.findOne({ email })
    if(user){
        res.statusCode(422)
        return next(
            new CustomException(
              // eslint-disable-next-line new-cap
              ErrorMessage.EMAIL_IN_USE(email),
              ErrorCodes.EMAIL_IN_USE
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
    const token = Jwt.signToken(tokenPayload(user))
    const data = formatUser(user, token)
    return res.json({ data })
}