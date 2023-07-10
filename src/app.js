const express=require('express')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const port=3000;
const app=express();
require('./db/conn')
const Detail=require("./models/schema");
const Goal=require("./models/goals");
const auth=require("./middleware/auth");
app.set('view engine',"ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieparser());

//home page Api
app.get("/register",(req,res)=>{
    res.render("register")
})

//Registeration 
app.post('/register',async(req,res)=>{
    try{
        //console.log(req.body);
const user= new Detail(req.body);
//const token=await user.generateToken();
const insert= await user.save();
res.render("register");
    }catch(err){
console.log(err);
    }
})
//login page
app.get("/login",(req,res)=>{
    res.render("login");
});
//login check
app.post("/login", async (req,res)=>{
    try{
    const email=req.body.email;
    const pd=req.body.password;
    const user=await Detail.findOne({email:email});
    
    const isMatch= await bcrypt.compare(pd,user.password);
    const token=await user.generateToken();
    res.cookie("jwt",token,{expires:new Date(Date.now()+120000),httpOnly:true})
   
    if(isMatch){
        //console.log(user);
        
        res.redirect("/profile/" + user._id);
    }else{
        res.send("invalid login details");
    }
}catch(err){
    console.log(err);
}
})
app.get("/profile/:userId",auth, async(req,res)=>{
    const userid=req.params.userId;
    const user= await Detail.findOne({_id:userid});
    const goalist=await Goal.find({user:userid})
    res.render("profile",{user:[user],goal:goalist});
})
app.get("/account/:userid",auth,async(req,res)=>{
    const userid=req.params.userid;
    const user=await Detail.findOne({_id:userid});
    res.render("account",{user:[user]});
})
app.post("/goal",auth,async(req,res)=>{
    try{
        const usergoal=new Goal(req.body);
        //console.log(usergoal);
        const insert=await usergoal.save();
        res.redirect("/profile/"+usergoal.user)
    }catch(e){
        res.send(e).status(404);
    }
})
app.get("/updateGoal/:goalid",auth,async(req,res)=>{
    try{
        const goalid=req.params.goalid;
    const goalitem=await Goal.find({_id:goalid});
    res.render("update",{goal:goalitem});
    }catch(e){
        res.send(e).status(404);
    }
})
app.post("/updateGoal/:id",auth,async(req,res)=>{
    try {
        const goalid=req.params.id;
        const update=await Goal.findOneAndUpdate({ _id:goalid}, { $set: { title:req.body.title, description:req.body.description} });
        res.redirect("/profile/"+update.user);
        
    } catch (error) {
        res.send(error)
    }
})
app.get("/deletegoal/:id",auth,async(req,res)=>{
try {
    const goalid=req.params.id;
    const deletegoal=await Goal.findByIdAndDelete({_id:goalid});
    res.redirect("/profile/"+deletegoal.user);

} catch (error) {
    res.send(error).status(404);
}
})
//logout handling
app.get("/logout",(req,res)=>{
    res.clearCookie('jwt');
    res.redirect("/register");
})
//server creation
app.listen(port,()=>{
    console.log("surver is running on port 3000")
})

// app.get("/update",auth,(req,res)=>{
//     res.render("update");
// })
// app.post("/change",auth,async(req,res)=>{
// try {
//     const name=req.body.name;
//     const email=req.body.email;
//     //console.log(req.body);
//     const OldEmail=req.body.oldemail;
//     const update=await Detail.findOneAndUpdate({ email:OldEmail}, { $set: { name:name, email:email} });
//     res.send("update success");
//    //console.log(update);
// } catch (error) {
//     res.status(404).send(error);
// }
// })
// app.post("/delete",auth,async(req,res)=>{
//     try {
//         const email = req.body.email;
//     const result = await Detail.deleteOne({ email:email });
//     //console.log(email);
//     res.send("delete success")
//     } catch (error) {
//         res.send(error).status(404);
//     }
// })
// app.listen(port,()=>{
//     console.log("surver is running on port 3000")
// })
//$2a$10$ztnmNUBY63nnUQnJ5y7h/.IbbaW7o5WWBngG5yjV1FM/.t5Ww2MKW