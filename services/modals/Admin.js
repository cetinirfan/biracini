var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Admin = new Schema({
    adminFullName: {
        type: String,
        required: true,
        trim: true,
    },
    telephone: {
        type: Number,
        trim: true,
    },
    mail: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    bannedUser:[],
    profilePhoto: {
        type: String,
        trim: true,
        default: 'https://i.hizliresim.com/lqBXgX.png'
    },
    adminCreated: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Admin', Admin);