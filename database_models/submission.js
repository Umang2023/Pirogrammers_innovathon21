const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const submissionSchema = new mongoose.Schema({
    language:{
        type:String
    },
    code:{
        type:String
    },
    verdict:{
        type:String
    },
    submittedBy:{
        type:ObjectId,
        ref:'User'
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission