const connectusers=require('../Models/connectionusers')
const express=require('express');

const {tokenmiddlware}=require('../middleware/loginmiddleware')
const User=require('../Models/signup');

const connectuserrouter=express.Router();

connectuserrouter.post('/connect/:userid/:status',tokenmiddlware,async(req,res)=>{
    try {
        const fromuser=req.id;
        const touser=req.params.userid;
        const status=req.params.status;

         const allowedstatus=['intersted','ignored']
            const isvalidsttaus=allowedstatus.includes(status)
            if(!isvalidsttaus){
            res.json({message:"invalid status",status:400})
            }
            //check to user exists or not 
            const isvalidtouser=await User.findOne({_id:touser})
            if(!isvalidtouser)
            {
                res.json({message:"user not found",status:400})
            }
            //////check the users already have the connection or not 
        const fromuserdetails=await  connectusers.findOne({
            $or:[
                {fromuser,touser},
                {fromuser:touser,touser:fromuser}
            ]
        });
    //    console.log(fromuserdetails)
        if(fromuserdetails)
        {
            res.json({
                message:"connection alreay exists",
                status:400
            })
        }
        else{
            const details={
                fromuser,
               touser,
                status
            }
            const addconnectuser= new  connectusers(details);
            await addconnectuser.save()
            res.send(` request successfull`)
        }  
    } catch (error) {
        res.send(error.message)
    }
})

connectuserrouter.post('/connect/review/:status/:userid',tokenmiddlware,async(req,res)=>{
    try {
        
        const touserid=req.id;
        const id=req.params.userid;
        const status=req.params.status;

        // console.log(touserid)
        // console.log(id)

        allowedstatus=['accepted','rejected'];
        if(!allowedstatus.includes(status))
        {
            res.send("invalid status provided")
        }

        const istouservalid=await connectusers.findOne({
            _id:id,
            touser:touserid,
            status:"intersted"

        })

        // console.log(istouservalid)

        if(!istouservalid){
            res.send("conection was not avaibale")
        }
        else{
            istouservalid.status=status

            await istouservalid.save();

            res.send(istouservalid)
                    }

    } catch (error) {
        res.send("Error" + error.message)
    }
})

connectuserrouter.get('/connect/intersteduserrequests',tokenmiddlware,async(req,res)=>{
    try {

        const userid=req.id;

        console.log("userid",userid)
        const intersteduser=await connectusers.find({
            touser:userid,
            status:"intersted"
        }).populate("fromuser","firstname lastname photourl about skills")
        console.log(intersteduser)
        res.send(intersteduser)
    } catch (error) {
        res.send("Error" + error.message)
    }   
})

module.exports=connectuserrouter;