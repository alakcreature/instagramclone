const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtkey=process.env.jwt_secret;
const User = mongoose.model("User");

module.exports = (req,res,next)=>{
    const {authorization} =req.headers;
    // console.log(req.headers);
    if(!authorization){
        return res.json({status:401,error:"you must be logged in."})
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,jwtkey,async(err,payload)=>{
        if(err){
            return res.json({status:401,error:"you must be logged in"});
        }

        const {userId} = payload;
        let user = await User.findById(userId).select("-password");
        req.user= user;
        next();
    })
}