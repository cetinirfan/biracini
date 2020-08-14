var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Application = new Schema({
    sendFortune: {
        type: String,
        trim: true,
    },
    fortunePhoto: {
        type: String,
    },
    speedPhoto: {
        type: String,
    },
    barleyPhoto: {
        type: String,
    },
});

module.exports = mongoose.model('Application', Application);