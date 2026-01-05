const express=require('express');
const { tokenmiddlware } = require('../middleware/loginmiddleware');
const Connectuser=require('../Models/connectionusers');
const User=require('../Models/signup')
const { set } = require('mongoose');
// const { useReducer } = require('react');                     
const connecteduser=express.Router();

connecteduser.get('/allrequestedusers',tokenmiddlware,async(req,res)=>{
    try {
       const userid=req.id;
       console.log("request",userid)
       const alluser=await Connectuser.find({
        $or:[{fromuser:userid},{touser:userid}]
       })
       res.send(alluser);
    } catch (error) {
        res.send("Error" + error.message)
    }
})

connecteduser.get('/connected/users/review',tokenmiddlware,async(req,res)=>{

    try {

        const userid=req.id;

        console.log("userid",userid)
        
        const checkconnecteduser=await Connectuser.find({
          $or:[{touser:userid,status:"accepted"},{fromuser:userid,status:"accepted"}]
        }).populate("fromuser","firstname lastname photourl about skills").populate("touser","firstname lastname photourl about skills")
        // console.log("users",checkconnecteduser)
        if(checkconnecteduser!=false)
            {
            const userinfo=checkconnecteduser.map(row=>{  
                console.log(row.fromuser._id.toString(),"  ",row.touser._id.toString())
                //compare both from and to id with current login user to fetch user accepted result 
            if(row.fromuser._id.toString()===row.touser._id.toString())
            {
                console.log("both are same",row.fromuser )
                return row.fromuser
                
            }
            else if(row.touser._id.toString()===userid.toString())
            {
                
                return row.fromuser
            }
            else{
                
                return row.touser
            }
        })

        // console.log("hi conecteduser ", userinfo)
        res.send(userinfo)
    }
            // return res.send(userinfo)
        else{
            res.send("No users")
        }
        
    } catch (error) {
        res.send('Error'+ error.message)
    }
})

connecteduser.get('/feed',tokenmiddlware,async(req,res)=>{
    try {
        const loggedinid=req.id;
        console.log("loggedinid",loggedinid);
        let page= req.query.page || 1;

        page = page < 0 ? 0 : page; 
        let limit= req.query.limit || 10;
        const skip =(page-1)*limit;
        // console.log(loggedinid)
        //get all the users which are sent by loggedin users and recived from others

        const allusers=await Connectuser.find({
            $or:[{fromuser:loggedinid},{touser:loggedinid}],
            

        }).select("fromuser touser");
        // console.log("allusers",allusers)
        // console.log("allusers",typeof allusers)
        if(Object.keys(allusers).length === 0){
            console.log("loggedin user not found in coonect")
            const intialuser=await User.find({_id:{$ne:loggedinid}}).select("_id");
            // console.log("pending user",intialuser)
            const userconnections=new Set();

        intialuser.forEach((element) => {

            userconnections.add(element._id);
            // userconnections.add(element.touser);
            
        });

        const requestneedtobesent= await User.find({
            $and:[
                {_id:{$in:Array.from(userconnections)}}
                ]
        }).select("firstname lastname photourl about skills").skip(skip).limit(limit)

        console.log("userconnection",userconnections)

        res.send(requestneedtobesent);
        }
        else{

            console.log("coonectd user")
             const userconnections=new Set();

        allusers.forEach((element) => {

            userconnections.add(element.fromuser);
            userconnections.add(element.touser);
            
        });

        const requestnotsentuser= await User.find({
            $and:[
                {_id:{$nin:Array.from(userconnections)}}
                ]
        }).select("firstname lastname photourl about skills").skip(skip).limit(limit)

        console.log("userconnection",userconnections)

        res.send(requestnotsentuser);
        }

        
    } catch (error) {
        res.status(400).send("Error" + error.message)
    }

})


module.exports=connecteduser;