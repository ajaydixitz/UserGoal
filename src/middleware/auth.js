const jwt=require("jsonwebtoken")
const Detail=require('../models/schema');
const auth=async(req,res,next)=>{
try {
    const token=req.cookies.jwt;
    const verify=jwt.verify(token,"mynameisajaydixitandiamabakenddeveloper");
    //console.log(verify);
   const user=await Detail.findOne({_id:verify._id});
   //console.log(user);
   if(!token){
    res.redirect("/login");
   }
   if(!user){
    res.redirect("/login")
   }
   else{
    next();
   }
} catch (error) {
    res.redirect('/login');
}
}
module.exports=auth;
