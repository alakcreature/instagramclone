const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwtkey = process.env.jwt_secret;
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

router.get("/test",(req,res)=>{
    res.send("hello");
})

router.post("/signup",async(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!name || !password || !email){
        return res.json({
            status: 422,
            error: "please add all the fields."
        });
    }
    let existing_user = await User.findOne({email});
    if(existing_user){
        res.json({status:422,message: "user already exixts"})
    }else{
        const hash = await bcrypt.hash(password, 10);
        const user=new User({
            email,
            password:hash,
            name,
            pic
        })
        let newuser = await user.save();
        console.log(newuser);
        res.json({
            status: 200,
            message: "successfully posted."
        })
    }
})

router.post("/signin",async(req,res)=>{
    console.log(req.body);
    const {email,password} = req.body;
    let user = await User.findOne({email}).lean();
    if(!user){
        return res.json({
            status: 422,
            messsage: "user not exist"
        });
    }else{
        let passwordmatch = await bcrypt.compare(password,user.password);
        if(!passwordmatch){
            return res.json({
                status:422,
                message: "invalid password or email"
            });
        }else{
            // delete user.password;
            const token = jwt.sign({userId: user._id},jwtkey);
            const {_id,name,email,followers,following,pic} = user;
            return res.json({
                token,
                user:{_id,name,email,followers,following,pic}
            });
        }
    }
})

module.exports = router;