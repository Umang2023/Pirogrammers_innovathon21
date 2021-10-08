const User  = require('../database_models/user')
const express=require('express')
const router=express.Router();
const passport=require('passport')

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/auth/google/callback',passport.authenticate('google'),(req,res)=>{
    console.log('here in callback')
    res.cookie('gid', req.user.googleId, {
        expires: new Date(Date.now() + 1000 * 15 * 24 * 60 * 60),
        httpOnly: true
    })

    res.redirect('http://localhost:5000/')
})

module.exports = router;