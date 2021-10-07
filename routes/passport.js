const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20').Strategy;
require('dotenv').config()
const User  = require('../database_models/user')

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    user = await User.findById(id)
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID_GOOGLE,
    clientSecret:process.env.CLIENT_SECRET_GOOGLE,
    callbackURL:process.env.REDIRECT_URI_GOOGLE,
    proxy:true
},async function(accessToken, refreshToken, profile, done){
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    var foundUser = await User.findOne({email:profile.emails[0].value})

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
}))

