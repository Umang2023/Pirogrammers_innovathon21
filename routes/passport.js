const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20').Strategy;
require('dotenv').config()
const User  = require('../database_models/user')

passport.serializeUser((user,done)=>{
    return done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    var user = await User.findById(id)
    return done(null,user)
})

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID_GOOGLE,
    clientSecret:process.env.CLIENT_SECRET_GOOGLE,
    callbackURL:process.env.REDIRECT_URI_GOOGLE,
    proxy:true
},async function(accessToken, refreshToken, profile, done){
    try{
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile)
        var foundUser = await User.findOne({googleId:profile.id})

        if(foundUser)
        {
            return done(null,foundUser)
        }
        else
        {
            const newUser = new User({
                googleId:profile.id,
                email:profile._json.email,
                name:profile.displayName,
                pic:profile._json.picture
            })

            var savedUser = await newUser.save()
            return done(null,savedUser)
        }
    }catch(error){
        console.log(error)
    }
    
}))

