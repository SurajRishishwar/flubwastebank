const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const db = require('./config/mongoose');
const port =  process.env.PORT||8000;

app.use(express.urlencoded());
app.use(cookieParser());

app.set('view engine','ejs');
app.set('views','./views');


app.use(express.static('./assets'));


app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log('server up at',port);
})