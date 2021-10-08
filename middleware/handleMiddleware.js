const User = require('../database_models/user')

const handleMiddleware = async (req,res,next)=>{
    try{
        
        cf = req.user.codeforces
        if(cf == null || cf == undefined || cf.length == 0)
        throw new Error('codeforces handle missing')
        
        next();
    }catch(error){
        console.log(error.message)
        res.redirect('/setup')
        // res.status(401).send(error)
    }
}

module.exports = handleMiddleware