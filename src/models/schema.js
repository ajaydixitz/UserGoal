const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    tokens:[
        {
            token:{type:String}
        }
    ]
})
//Generate token
userSchema.methods.generateToken=async function(){
    try {
        const newToken= jwt.sign({_id:this._id.toString()},"mynameisajaydixitandiamabakenddeveloper");
        //console.log(token);
        
        this.tokens=this.tokens.concat({token:newToken})
         await this.save();
        return newToken;
    } catch (error) {
        console.log(error)
    }
}
//password hash
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        //console.log(this.password);
        this.password=await bcrypt.hash(this.password,10);
       // console.log(this.password);
    }
    next();
})
const Detail= new mongoose.model("Detail",userSchema);

module.exports=Detail;