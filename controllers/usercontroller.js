const users=require('../models/users');
const accesstoken=require('../models/verifiedtokens');
const requestcall=require('../models/userwastequery');
const redeemcoins=require('../models/coin');
const contact=require('../models/contact');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const saltr=3; 
const linkmail= require('../mailers/verifyuser');
const { findOne } = require('../models/users');

module.exports.signin=function(req,res){
    if(req.cookies.FlubWaste){
        res.redirect('/users/home');
    }
    else{
        res.render('login',{
            title:"Sign In | Flub Waste",
        });
    }
}
module.exports.signup=function(req,res){
    if(req.cookies.FlubWaste){
        res.redirect('/users/home');
    }
    else{
        res.render('signup',{
            title:"Sign Up | Flub Waste",
        });
    }
}
module.exports.profile=async function(req,res){
    profile=await users.findById(req.user.id);

        res.render('profile',{
            title:"Profile | Flub Waste",
            profile:profile
        });

}
module.exports.update= async function(req,res){
    profile=await users.findById(req.user.id);
    res.render('update',{
        title:"Update | Flub Waste",
        profile:profile
    });

}

module.exports.usershome= async function(req,res){
    profile=await users.findById(req.user.id);
    res.render('usershome',{
        title:"Home | Flub Waste",
        profile:profile
    });
    
}


module.exports.request= async function(req,res){
    profile=await users.findById(req.user.id);
    res.render('collectionform',{
        title:"Request | Flub Waste",
        profile:profile
    });
}

module.exports.logout=function(req,res){
    res.clearCookie("FlubWaste");
    return res.redirect('/');
}

module.exports.create=async function(req,res){
   try{
    let existuserd=await users.findOne({email:req.body.email,status:"Active"});
    if(existuserd){
        return res.render('signup',{
            title:"Sign Up | Flub Waste",
            //email already exist
        });
    }
    let existuserp=await users.findOne({email:req.body.email,status:"Pending"});
    if(existuserp){
        let del=await users.findOneAndDelete({email:existuserp.email});
    }
    
    // let deleteuser=await users.findOneAndDelete({email:existuserp.email});
    let existuser=await users.findOne({email:req.body.email});
    let newuser;
    if(!existuser){
        let hashpass=await bcrypt.hash(req.body.password, saltr);
        newuser=await users.create({
            email:req.body.email,
            name:req.body.name,
            phone:req.body.phone,
            password:hashpass,
            houseno:"N/A",
            status:"Pending",
            street:"N/A",
            ward:0,
            city:"N/A",
            stateut:"N/A",
            coins:0,
            uhn:"N/A"
            //unique house number
        });
        // console.log(newuser.id);
    }   
    let setat;

    if(newuser){
        setat=await accesstoken.create({
            userid:newuser.id,
            accesstokenvalue:crypto.randomBytes(120).toString('hex'),
            isvalid:true
        });
    }
    setat=await accesstoken.findOne({userid:newuser.id});

    linkmail.newuserverify(newuser.email,setat.accesstokenvalue,newuser.name);
    return res.render('calllink',{
        title:"Flub Waste"
        //check your mail
    });
   

   
   }catch(err){
       console.log(err);
   }
}


module.exports.authenticate=async function(req,res){
    

    try{
        let token;
        let requestedsuser=await users.findOne({email:req.body.email,status:"Active"});
        //console.log(requestedsuser);
        if(requestedsuser){
            let match=await bcrypt.compare(req.body.password,requestedsuser.password);
            if(match){
                
                //var token=jwt.sign({requestedsuser},'hithisismyemprojecttomakemyresumebig',{expiresIn: '35d'});
                token = await requestedsuser.generateAuthToken();
                //console.log(token);
                // console.log('token saved in cookies and db');
            
                res.cookie("FlubWaste", token, {
                    httpOnly: true,
                    secure:false,
                
                });
               
           
                return res.redirect('/users/home');
            }else{
                return res.render('login',{
                    title:"Sign In | Flub Waste",
                    isAdded:'Wrong Password'
            
                });
            }
        }else{
            return res.render('login',{
                title:"Sign In | Flub Waste",
                isAdded:'User Not Found'
        
            });
        }
 
    }catch(err){
        console.log('kya h',err);
    }

}



module.exports.verify=async function(req,res){
    const accesstokenvalue=req.params.accesstokenvalue;
    // console.log('got the token',accesstokenvalue);
    let userstoken=await accesstoken.findOne({accesstokenvalue,isvalid:true});
    // console.log('token mil gya',userstoken);
    if(userstoken){
        let updatetoken = await accesstoken.findOneAndUpdate({userid:userstoken.userid},{isvalid:false});
        let updateactive= await users.findByIdAndUpdate(userstoken.userid,{status:"Active"});
        let updateuser= await users.findById(userstoken.userid);
        // console.log('updated ',updateuser);
        let token = await updateuser.generateAuthToken();
        console.log(token);
        console.log('token saved in cookies and db');
        res.cookie("FlubWaste", token, {
            httpOnly: true,
            secure:false,
        });
        // here changes---------------------------------------------------------
        return res.redirect('/users/home');
    }
}

module.exports.updatedetails=async function(req,res){
    try{
        updated=await users.findByIdAndUpdate(req.user.id,{
            name:req.body.name,
            phone:req.body.phone,
            houseno:req.body.houseno,
            street:req.body.street,
            ward:req.body.ward,
            stateut:req.body.stateut,
            city:req.body.city
        });
        console.log(updated);
        profile=await users.findById(req.user.id);
    
        return res.render('profile',{
            title:"Profile | Flub Waste",
            profile:profile
        });
    }catch(err){
        console.log(err);
    }
}

module.exports.requestcall= async function(req,res){
    try{
        collectionreq=await requestcall.create({
            user:req.body.user,
            waste:req.body.waste,
            quantity:req.body.quantity,
            pickupdate:req.body.date,
            pickuptime:req.body.time,
            status:"N/A",
            verifyotp:2126,
            custverifystatus:false,
            address:req.body.address
        });
        console.log(collectionreq);
        return res.render('requestcall',{
            title:"Request | Flub Waste"
        });

    }catch(err){
        console.log(err);
    }
}

module.exports.redeem=async function(req,res){
    try{
        profile=await users.findById(req.user.id);
        pcoins=profile.coins;
        return res.render('redeemcoin',{
            title:"Flub Waste | Coins",
            profile:profile,
            pcoins:pcoins
        });
    }catch(err){
        console.log(err);
        return;
    }
}
module.exports.redeemamazon=async function(req,res){
    try{
       redeem = await redeemcoins.create({
            userid:req.body.user,
            coins:req.body.coins
        });
        original=await users.findById(redeem.userid);
        original.coins=original.coins-redeem.coins
        if(redeem){
            await users.findByIdAndUpdate(redeem.userid,{coins:original.coins});
            return res.redirect('/users/profile');
            // return res.render('requestcall',{
            //     title:"Request | Flub Waste"
            // });
        }
    }catch(err){
        console.log(err);
    }
}
module.exports.contactpage=async function(req,res){
    try{
        profile=await users.findById(req.user.id);

        return res.render('contact',{
            title:"Flub Waste | Contact",
            profile:profile
        })
    }catch(err){
        console.log(err);   
    }
}

module.exports.contactmsg=async function(req,res){
    await contact.create({
        userid:req.body.userid,
        msg:req.body.msg
    });
    return res.render('contact',{
        title:"Flub Waste | Contact",
        profile:profile
    })
}

module.exports.privacy=function(req,res){
    return res.render('privacy',{
        title:"Flub Waste | Privacy"
    });
}