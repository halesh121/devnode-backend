
const mongoosedb=require('mongoose');
// const User=require('../Models/signup')

const connectuser=new mongoosedb.Schema({
    fromuser:{
        type:String,
        ref:"Users",
        fromuserid:mongoosedb.Schema.Types.ObjectId,
    },
    touser:{
        type:String,
        ref:"Users",
        touserid:mongoosedb.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enums:{
           value: ["intersted","ignore","accepted","rejected"],
           message:`{value} is incorrect staus type`
        }
    },
},{
    timestamps:true
})

connectuser.pre("save",function(next){
    const user=this;

    if (user.fromuser==user.touser)
    {
        throw new Error("same user cannot to be requested")
    }
   
next()
    

    
});

const Userconnection=new mongoosedb.model('Connectusers',connectuser)


module.exports=Userconnection;