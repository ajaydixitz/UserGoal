const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/userRegistration', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log(" database connect");
}).catch(()=>{
    console.log("no connection")
})