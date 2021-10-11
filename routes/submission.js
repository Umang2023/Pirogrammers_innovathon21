const express=require('express')
const router=express.Router();
const User  = require('../database_models/user')
const Submission  = require('../database_models/submission')
const authMiddleware = require('../middleware/authMiddleware')
const handleMiddleware = require('../middleware/handleMiddleware')
const fetch = require('node-fetch')
const verification = require('../database_models/code')

async function checkSubmission(question , code, language)
{
    switch(question)
    {
        case 'CQXYM Count Permutations':{
            question=0
            break;
        }
        case 'Contest Start':{
            question=1
            break;
        }
        case 'Slay the Dragon':{
            question=2
            break;
        }
        default:{
            question:0
        }
    }

    var inputString = ""

    // console.log(question , verification[question].input)

    for(var i=0; i<verification[question].input.length; ++i)
    {
        inputString+= verification[question].input[i].toString();
        inputString+= '\n';
    }
    // console.log(inputString)

    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = "https://api.jdoodle.com/v1/execute";

    var compilationOutput = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body:JSON.stringify({
                script: code,
                language: language,
                versionIndex: "0",
                stdin: inputString,
                clientId: process.env.CLIENT_ID_JDOODLE,
                clientSecret: process.env.CLIENT_SECRET_JDOODLE,
            })
        })
        .then(t=>t.json())

    // console.log(compilationOutput)
    
    if(compilationOutput.memory == null || compilationOutput.cpuTime == null)
    {
        if(compilationOutput.output.includes('Timeout'))
        return {
            isError:true,
            verdict:"Time Limit Exceeded",
            compilerOutput:compilationOutput.output
        }
    }

    if(!compilationOutput.output.includes('\n'))
    {
        return {
            isError:true,
            verdict:"Run Time Error",
            compilerOutput:compilationOutput.output
        }
    }

    var output = compilationOutput.output.split('\n')

    // console.log(output)
        
    for(var i=0; i<output.length-1; ++i)
    {
        if(verification[question].output[i].toString() != output[i])
        {
            // console.log(i+1,verification[question].output[i].toString() , output[i])
            return {
                isError:true,
                verdict:"Wrong Answer",
                compilerOutput:compilationOutput.output
            }
        }
    }

    return {
        isError:false,
        verdict:"Accepted",
        compilerOutput:compilationOutput.output
    }

}

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
                stdin: "",
                clientId: process.env.CLIENT_ID_JDOODLE,
                clientSecret: process.env.CLIENT_SECRET_JDOODLE,
            })
        })
        .then(t=>t.json())

        // console.log(data)

        // var receivedOutput = data.output.split('\n')
        // console.log(receivedOutput)

        // for(var i=0; i<receivedOutput.length-1; ++i)
        // {
        //     if(verification.p1.output[i] != parseInt(receivedOutput[i]))
        //     console.log('wrong answer')
        // }

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
        var question = req.body.question
        // console.log(code)

        var verdictReceived = await checkSubmission(question,code,language)
        // console.log(verdictReceived)

        var newSubmission = new Submission({
            code,
            language,
            verdict:verdictReceived.verdict,
            question,
            submittedBy:req.user.id
        })

        var savedSubmission = await newSubmission.save();

        var updatedUser = await User.findByIdAndUpdate(req.user.id,{
            $push:{submissions:savedSubmission}
        },{
            new:true
        })

        return res.status(200).json({isError:false,verdict:verdictReceived,output:verdictReceived.compilerOutput})

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

router.get('/submissions',authMiddleware,async(req,res)=>{
    try{
        var aggList = []

        var temp = {
            $lookup:{
                from:"users",
                localField:"submittedBy",
                foreignField:"_id",
                as:"userHandle"
            },
        }

        aggList.push(temp)

        var verdict=req.query.verdictSelected
        var question=req.query.questionSelected
        var user=req.query.userSelected || req.user.codeforces

        if(verdict && verdict.length > 0 && verdict != 'All')
        {
            var temp={
                $match:{verdict:verdict}
            }
            aggList.push(temp)
        }

        if(question && question != 'All')
        {
            // console.log('question')
            var temp={
                $match:{question:question}
            }
            aggList.push(temp)
        }

        if(user && user.length > 0 && user != 'All')
        {
            // console.log(user)
            var temp={
                $match:{"userHandle.codeforces":user}
            }
            aggList.push(temp)
        }

        var result = await Submission.aggregate(aggList)
        return res.status(200).json({isError:false,data:result})

    }catch(error){
        console.log(error.message)
        return res.status(400).json({isError:true,message:error.message})
    }
})

router.get('/submissions/:id',authMiddleware,async(req,res)=>{
    var id = req.params.id
    console.log(id)
    var code = await Submission.findById(id)
    console.log(code)
    return res.json({data:code})
})

module.exports = router;