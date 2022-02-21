const mongoose = require('mongoose');
const redeemcoin = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    coins:{
        type:String,
        required:true
    },
    

}, {
    timestamps:true
});

const redcoin = mongoose.model('redcoin',redeemcoin);
module.exports = redcoin;