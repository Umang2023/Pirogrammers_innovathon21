const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://localhost:27017/jaggacode', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('connected to database')
})
mongoose.connection.on('error', () => {
    console.log('failed to connect to database')
})

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/html/home.html')
})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})