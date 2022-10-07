require('dotenv').config()

const server = require('./server/index')

require('debug')('server')

const port = process.env.PORT || 4045

server.listen(port, () => {
    console.log(`Server Running on Port ${port}`)
})