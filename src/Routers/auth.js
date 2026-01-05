const express=require('express');
const User=require('../Models/signup')
const cookie=require('cookie-parser');
const {tokenmiddlware}=require('../middleware/loginmiddleware')
const becrypt=require('bcrypt')
const authrouter =express.Router();


authrouter.post('/signup',async(req,res)=>{
   try {
    
    const k=req.body;
    const keys=Object.keys(k);
    const allowedparam=["firstname","lastname","email","password"]
    const c=keys.every(x=>allowedparam.includes(x))
    if(!c)
    {
        throw new Error("invlaid inputs given")
    }
    else{

        // console.log(typeof(k.password))
        const haspass= await becrypt.hash(k.password,10);
        // const has2=await becrypt.hash("halesh@123",10)
        // console.log(haspass)
        // console.log(has2)
       const detals={"firstname":k.firstname,
        "lastname":k.lastname,
        "email":k.email,
        "password":haspass,
       
       }
    //    console.log(detals);
            const a=new User(detals);
            await a.save();
            res.send("inserted succssfully")
    }   
   } catch (error) {
    res.send(error.message)
   }    
})

authrouter.post('/login',async(req,res)=>{
    try{
        console.log(req.body)
        const email=req.body.email;
        const inputpassword=req.body.password;
         const emailveri=await User.findOne({email:email})
         if(emailveri)
         {
            // console.log(typeof(password))
            ///this are all function handler it worked under /Models/singup.js by taking emailveri as the instance
            let validpassowrd= emailveri.validatepassword(inputpassword);

            console.log("hi" + validpassowrd);
                if(!validpassowrd)
                {
                    res.send("invalid password")
                }
                else{
                    
                   const token=await  emailveri.getjwt();
                //    console.log(emailveri);
                    res.cookie("token",token)
                    res.send(emailveri)
                }
         }
         else
         {
            throw new Error("invalid email")
         }
    }
    catch(error){
    res.status(401).send(error.message)
    }
})

authrouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    }).send("logout successfully");
})






module.exports=authrouter;