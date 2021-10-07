const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    pic:{
        type:String
    },
    googleId:{
        type:String
    },
    codeforces_handle:{
        type:String
    },
    currentSavedCode:{
        type:String
    },
    submissions:[{
        type:ObjectId,
        ref:'Submission'
    }],
    time:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User