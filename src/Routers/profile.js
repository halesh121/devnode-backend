const express=require('express');
const User=require('../Models/signup')
const profilerouter =express.Router();
const {tokenmiddlware}=require('../middleware/loginmiddleware')

const {validator}=require('../utility/userinputvalidataor')

profilerouter.get('/userinfo',tokenmiddlware,async(req,res,next)=>{
    
    // console.log(req.id);
    
    try{
    const id=req.id;

    // console.log(id)

    const userinfo=await User.findOne({_id:id});

    res.send(userinfo);
    }
    catch(e){
        res.status(401).send(e.message)
    }
})

profilerouter.patch('/profile/edit',tokenmiddlware,async(req,res,next)=>
{
    try{
    const a = await validator;
    if(!a){
            const user_id=req.id;
            // const userfileds=Object.key
            const userdetails=await User.findOne({_id:user_id});
            
            const userfileds=Object.keys(req.body).every(x=>userdetails[x]=req.body[x])
            await userdetails.save();
            
            res.send(userdetails);

    }
}
catch(error)
{
    res.send(error.message)
}
})

profilerouter.post('/forgotpassword',tokenmiddlware,(req,res)=>{
    
})


module.exports=profilerouter;