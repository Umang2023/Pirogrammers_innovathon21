const User = require('../database_models/user')

const authMiddleware = async (req,res,next)=>{
    try{
        const token = req.cookies.gid
        const user=await User.findOne({googleId :token})
        // console.log(user)
        req.user=user
        if(!user)
        throw new Error('not found')
        
        next();
    }catch(error){
        res.redirect('/home')
        // res.status(401).send(error)
    }
}

module.exports = authMiddleware