
const express = require('express')
const cors=require('cors')
const {db}=require('./config/database.js')
const authrouter=require('./Routers/auth.js') 
const profile=require('./Routers/profile.js')
const cookieParser = require('cookie-parser')
const profilerouter = require('./Routers/profile.js')
const connectinguser=require('./Routers/connectingusers.js')
const connecteduser=require('./Routers/connecteduser.js')

const app = express();






app.use(express.json());
app.use(cookieParser());

app.use(cors({
    
 origin: 'http://13.204.63.199/', // no trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true

}));




 app.use('/',authrouter);
 app.use('/',profilerouter)
 app.use('/',connectinguser);
 app.use('/',connecteduser)
 


db().then(()=>{
    console.log("database connected")
    app.listen(3000,()=>{
        console.log("server listening ot 3000")
    });
   
})
.catch((err)=>{
console.error(err)
})





