module.exports.home=function(req,res){
    if(req.cookies.FlubWaste){
        res.redirect('/users/home');
    }
    else{
        res.render('home',{
            title:"Flub Waste",
        });
    }
}