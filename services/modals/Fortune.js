const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Fortune = new Schema({
    fullName:{
        type:String
    },
    job:{
        type:String
    },
    fortuneType:{
        type:Number,
        default:0,
    },
    fortuneView:{
        type:Number,
        default:0,
    },
    gender:{
        type:String
    },
    birthday:{
        type:String
    },
    fortunePhoto:{
        type:String,
    },
    fortuneAnswerTitle:{
        type:String,
    },
    fortuneAnswer:{
        type:String,
    },
    fortuneComment:{
        type:String,
    }, 
    fortuneRating:{
        type:Number,
        default:-1,
    },
    userFullName:{
        type:String,
    },
    userTelephone:{
        type:String,
    },
    fortuneUser:{
        type: mongoose.Types.ObjectId
    },
    fortuneCreated:{
        type:Date,
    }
});

module.exports = mongoose.model('Fortune', Fortune);
