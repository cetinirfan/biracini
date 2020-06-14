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
    gender:{
        type:String
    },
    birthday:{
        type:String
    },
    fortunePhoto:{
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
        default:0,
    },
    fortuneUser:{
        type: mongoose.Types.ObjectId
    },
    fortuneCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Fortune', Fortune);
