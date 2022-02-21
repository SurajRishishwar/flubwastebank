const mongoose = require('mongoose');

mongoose.connect('');

const db =mongoose.connection;
db.on('error ',console.error.bind(console,"Error"));
db.once('open',function(){
    console.log('connected');
});
module.exports=db;
