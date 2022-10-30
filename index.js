const apiRouter = require('./server/routes/index')
require('dotenv').config()


const server = require('./server/index')

require('debug')('server')

// api router
server.use("/api", apiRouter);


const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server running on ${port}`)
})