const express=require('express')
const router=express.Router();
const User  = require('../database_models/user')

router.get('/current',async (req,res)=>{
    return res.json(req.user)
})

router.get('/logout',async (req,res)=>{
    req.logOut()
    return req.user
})

module.exports = router;