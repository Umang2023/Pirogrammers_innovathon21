const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const passport = require('passport')
const cookieSession = require('cookie-session')
const cookieParse = require('cookie-parser')
const cookieParser = require('cookie-parser')
const authMiddleware = require('./middleware/authMiddleware')
const handleMiddleware = require('./middleware/handleMiddleware')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect('mongodb://localhost:27017/jaggacode', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('connected to database')
})
mongoose.connection.on('error', () => {
    console.log('failed to connect to database')
})

app.use(express.static('public'))
require('./routes/passport')

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['abcd']
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())


app.use(require('./routes/authentication'))
app.use('/user', require('./routes/user'))
app.use('/code', require('./routes/submission'))

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html')
})

app.get('/', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/dashboard.html')
})

app.get('/dashboard', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/dashboard.html')
})

app.get('/setup', authMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/userSetup.html')
})

app.get('/profile', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/profile.html')
})

app.get('/editor', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/editor.html')
})

app.get('/code', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/code.html')
})
app.get('/stats', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/stats.html')
})
app.get('/practice', authMiddleware, handleMiddleware, (req, res) => {
    res.sendFile(__dirname + '/public/html/practice.html')
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})