const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const { App } = require('./middleware')

const server = express()



const start = async () => {
    try{
     await mongoose.connect('mongodb://127.0.0.1:27017/fastFood?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0',{ useUnifiedTopology: true } )
     console.log('connection to Mongodb was successful')
    }catch(e){
     console.log(e)
    }
} 



start()

App(server)

module.exports = server