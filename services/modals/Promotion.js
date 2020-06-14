const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Promotion = new Schema({
    promotionCode:{
        type:String
    },
    promotionCount:{
        type:String
    },
    promotionRights:{
        type:String
    },
    promotionCreated: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Promotion', Promotion);
