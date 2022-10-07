const Express = require('express')
const logger = require('morgan')
const cors = require('cors')
constpath = require('path')

/**
 * @param  {Express.Application} server
 */

module.exports =(server) => {
    server.use(logger('dev'))
    server.use(Express.json())
    server.use(Express.urlencoded({ extended: false }));
    server.use(cors())
}