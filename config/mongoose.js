const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://alpit:AlpitNamdev@cluster0.oueuw.mongodb.net/rrrrData?retryWrites=true&w=majority');

const db =mongoose.connection;
db.on('error ',console.error.bind(console,"Error"));
db.once('open',function(){
    console.log('connected');
});
module.exports=db;