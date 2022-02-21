const jwt = require('jsonwebtoken');
const users = require("../models/users");



const Authenticate = async (req,res,next) => {
    try {
        const token = req.cookies.FlubWaste
        // console.log(token);
        const verifyToken = jwt.verify(token,'loaavvxhet52jnmxmlsieryoqamh3hdv5r1ref5e1eeporevbhdy');
        // console.log(verifyToken);
        const rootUser = await users.findOne({id:verifyToken.id, "tokens.token": token});
        // console.log(rootUser);
        if(!rootUser){ 
            return res.render('login',{
                title:"Sign In | Flub Waste"
            });
        }else{
            req.token = token;
            //req.rootUser = rootUser;
            req.user = rootUser;
            next();
        }

    }catch (err) {
        console.log(err);
        console.log('kya h',err);
   
        res.redirect('/users/signin');
        
    }

}

module.exports = Authenticate;