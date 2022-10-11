const express = require('express')

const apiRouter = express.Router()
const Middleware = require('../middleware')
const  UserController  = require('../controller/user')
const productRouter = require('./product') 
const orderRouter = require('./order')

// apiRouter.use(Middleware.ApiGuard);

// user signup and login
apiRouter.post('/login', UserController.userLogin).post('/register', UserController.userRegister)

apiRouter.use('/product', productRouter)
apiRouter.use('/order', orderRouter)

apiRouter.use(Middleware.Four04Handler);
// handle all unhandled error
apiRouter.use(Middleware.ErrorHandler);




module.exports = apiRouter;