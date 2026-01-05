const validator=require('validator');

const inputvalidator=(req,res)=>{

    allowedinputfiled=["firstname","lastname","age","photourl","about","skills"]

    const keys=Object.keys(req.body)

    const isvalid=keys.every(x=>allowedinputfiled.includes(x))

    return isvalid;
}

module.exports={inputvalidator};