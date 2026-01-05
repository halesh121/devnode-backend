const dbschema=require('mongoose')
const validtor=require('validator');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

// console.log("model")
const signupmodel=dbschema.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
   
    email:{
        type:String,
        require:true,
        trim:true,
        validate(value){
        if(!validtor.isEmail(value))
        {
            throw new Error("invalid email")
        }
        }
    },
    password:{
        type:String,
        require:true,
        maxLength:500,
        trim:true
        
        
    },
     age:{
        type:Number,
        require:true,
        maxLength:2
     },
     gender:{
        type:String,
        trim:true,
     },
     about:{
        type:String,
        maxLength:140,

     },
     photourl:{
        type:String,
        default:'https://www.bing.com/images/search?q=child+images&id=4814B375058BDC2832A3EFFB6F85F5046F6C13EB&FORM=IACFIR',
        trim:true
     },
    skills:[String],
    
},{
    timestamps:true,
});
// this keyword is th instance of router/signup.js db result user
//arrow function not works with normall functions and below methods alwys normal functions not arrow function.
signupmodel.methods.getjwt=async function(){
    const user=this;
    const token=await jwt.sign({id:user._id},"hal@123")
    // console.log(token)
       return token;
};
// this keyword is th instance of router/signup.js db result user  
signupmodel.methods.validatepassword=  async function(inputpassword){
    const user=this;
    console.log(user.password," ",  inputpassword)
   const isvalidpassowrd=  await bcrypt.compare(inputpassword,user.password);
   console.log("modle" + isvalidpassowrd)
            return isvalidpassowrd;
};

const user= new dbschema.model('Users',signupmodel);

module.exports=user;

