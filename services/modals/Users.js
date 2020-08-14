const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    fullName:{
        type:String
    },
    password:{
        type:String
    }, 
    telephone:{
        type:Number,
        unique:true
    },
    job:{
        type:String
    },
    gender:{
        type:Number
    },
    birthday:{
        type:String
    },
    fortuneCount:{
        type:String,
        default:2
    },
    oneSignal:{ 
        type:String,
        default:'a'
    },
    mail:{
        type:String
    },
    userBanType:{
        type:Number,
        default:0,
    },
    userSmsCode:{
        type:String,
    },
    promotionCode:[],
    userFortunes:[{type: mongoose.Types.ObjectId, ref: 'Fortune'}],
    userCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Users', Users);
