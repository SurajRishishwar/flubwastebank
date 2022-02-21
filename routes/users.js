const express=require('express');
const router=express.Router();
const Auth=require('../config/authentication');
const usercontroller=require('../controllers/usercontroller');


router.get('/signin',usercontroller.signin);
router.get('/signup',usercontroller.signup);
router.get('/logout',usercontroller.logout);
router.post('/createuser',usercontroller.create);
router.post('/authenticateuser',usercontroller.authenticate);
router.get('/home',Auth,usercontroller.usershome);
router.get('/profile',Auth,usercontroller.profile);
router.get('/update',Auth,usercontroller.update);
router.get('/requestcollection',Auth,usercontroller.request);
router.post('/requestcall',Auth,usercontroller.requestcall);
router.post('/updatedetails',Auth,usercontroller.updatedetails);
router.get('/verify/:accesstokenvalue',usercontroller.verify);
router.get('/redeemcoin',Auth,usercontroller.redeem);
router.post('/redeemcoinamazon',Auth,usercontroller.redeemamazon);
router.get('/contact',Auth,usercontroller.contactpage);
router.post('/contactmsg',Auth,usercontroller.contactmsg);
router.get('/privacy',usercontroller.privacy);


module.exports=router;