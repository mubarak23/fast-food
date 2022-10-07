const express = require('express')
const path = require('path')
const { App } = require('./middleware')

const server = express()

App(server)

module.exports = server