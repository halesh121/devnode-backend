const cookie=require('cookie-parser');
const jwt=require('jsonwebtoken')

// console.log("Hi token")
const  tokenmiddlware=async(req,res,next)=>{
    // console.log("cookies",req.cookies)
    try{
        
        ///////fetch the token from the browser/postman
    const {token}=req.cookies;

    // console.log(token)

    if(token){

    const jsontoken=await jwt.verify(token,"hal@123")
    if(!jsontoken)
    {
       
        throw new Error("login again")
    }
    else{
         
        req.id=jsontoken.id;
        
    }
    next();
    }
    else{
        throw new Error("token not avaiable! login again")
    }
}
catch(error)
{
    res.status(401).send(error.message)
}
    
    
}

module.exports={tokenmiddlware};
