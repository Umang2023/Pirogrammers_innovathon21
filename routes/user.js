const express=require('express')
const router=express.Router();
const User  = require('../database_models/user')
const authMiddleware = require('../middleware/authMiddleware')
const fetch = require('node-fetch')

router.get('/test',authMiddleware,(req,res)=>{
    // console.log(req.cookies)
    var diff = (Date.now() - req.user.time)/(1000*60)
    return res.json(diff)
})

router.get('/current',authMiddleware,async (req,res)=>{
    return res.json(req.user)
})

router.post('/setup',authMiddleware, async(req,res)=>{
    try{
        var body = req.body;
        // console.log(body)
        var updatedUser = await User.findByIdAndUpdate(req.user.id,{
            codeforces:body.codeforces,
            codechef:body.codechef,
            leetcode:body.leetcode,
            atcoder:body.atcoder,
            spoj:body.Spoj,
        },{
            new:true
        })

        // console.log(updatedUser)
        // return res.status(200).json({isError:false, data:updatedUser})
        return res.redirect('/')

    }catch(error){
        return res.status(400).json({isError:true, message:error.message})
    }
})

router.get('/logout', async (req,res)=>{

    res.clearCookie('gid', {
        path: '/'
    });
    res.clearCookie('express:sess.sig', {
        path: '/'
    });
    res.clearCookie('express:sess', {
        path: '/'
    });
    
    req.logOut()
    res.redirect('/home')
})

router.get('/submissions',authMiddleware,async(req,res)=>{
    try{

        var data = await User.aggregate([
            {
                $lookup:{
                    "from":"submissions",
                    "localField":"submissions",
                    "foreignField":"_id",
                    "as":"submissionDetails"
                }
            },
            {
                $project:{
                    "submissionDetails":1
                }
            }
        ])
        return res.status(200).json({isError:false,data:data})
    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

module.exports = router;