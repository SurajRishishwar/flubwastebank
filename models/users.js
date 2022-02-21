const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const users = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    houseno:{
        type:String,
        required:true
    },
    ward:{
        type:Number,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    stateut:{
        type:String,
        required:true
    },
    uhn:{
        type:String,
    },
    status:{
       type:String,
       required:true
    },
    coins:{
        type:Number,
        required:true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],

}, {
    timestamps:true
});


users.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, 'loaavvxhet52jnmxmlsieryoqamh3hdv5r1ref5e1eeporevbhdy');
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

const user = mongoose.model('user',users);
module.exports = user;