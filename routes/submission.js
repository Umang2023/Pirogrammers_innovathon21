const express=require('express')
const router=express.Router();
const User  = require('../database_models/user')
const Submission  = require('../database_models/submission')
const authMiddleware = require('../middleware/authMiddleware')
const handleMiddleware = require('../middleware/handleMiddleware')
const fetch = require('node-fetch')

router.post('/compileCode', async (req,res)=>{
    try{
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const url = "https://api.jdoodle.com/v1/execute";

        var data = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body:JSON.stringify({
                script: req.body.codeWritten,
                language: req.body.language,
                versionIndex: "0",
                stdin: req.body.inputGiven,
                clientId: process.env.CLIENT_ID_JDOODLE,
                clientSecret: process.env.CLIENT_SECRET_JDOODLE,
            })
        })
        .then(t=>t.json())

        // console.log(data)
        return res.status(200).json({isError:false,data:data})

    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

router.put('/submit',authMiddleware,async(req,res)=>{
    try{
        var code = req.body.code;
        var verdict = req.body.verdict
        var language = req.body.language
        // console.log(req.user)

        var newSubmission = new Submission({
            code,
            language,
            verdict,
            submittedBy:req.user.id
        })

        var savedSubmission = await newSubmission.save();

        var updatedUser = await User.findByIdAndUpdate(req.user.id,{
            $push:{submissions:savedSubmission}
        },{
            new:true
        })

        return res.status(200).json({isError:false,data:updatedUser})

    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

router.put('/saveCode',authMiddleware,async(req,res)=>{
    try{
        var updatedUser = await User.findByIdAndUpdate(req.user.id,{
            currentSavedCode:req.body.code
        },{
            new:true
        })
        return res.status(200).json({isError:false,data:updatedUser})
    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

router.get('/previous',authMiddleware,async(req,res)=>{
    try{
        return res.status(200).json({isError:false,data:req.user.currentSavedCode})
    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

module.exports = router;