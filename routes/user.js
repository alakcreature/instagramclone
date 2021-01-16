const router = require("express").Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

router.get("/user/:id",requireLogin,async(req,res)=>{
    let user = await User.findOne({_id:req.params.id}).select("-password").lean();
    if(!user){
        return res.json({
            status:404,
            error:"user not found"
        })
    }
    let posts = await Post.find({postedBy:req.params.id}).lean();
    if(!posts){
        return res.json({
            status:422,
            error:"server error"
        });
    }
    return res.status(200).json({user,posts});
});

router.put("/follow",requireLogin,async(req,res)=>{
    let {followid} = req.body;
    let updateduser = await User.findByIdAndUpdate(followid,{
        $push:{followers:req.user._id}
    },{new:true});
    if(!updateduser){return res.json({status:500,error:"server error"})}
    else{
        let loggedinuser = await User.findByIdAndUpdate(req.user._id,{
            $push:{following:followid}
        },{new:true}).select("-password");
        if(!loggedinuser){return res.json({status:500,error:"server error"})}
        else{return res.json(loggedinuser)}
    }
});

router.put("/unfollow",requireLogin,async(req,res)=>{
    let {unfollowid} = req.body;
    let updateduser = await User.findByIdAndUpdate(unfollowid,{
        $pull:{followers:req.user._id}
    },{new:true});
    if(!updateduser){return res.json({status:500,error:"server error"})}
    else{
        let loggedinuser = await User.findByIdAndUpdate(req.user._id,{
            $pull:{following:unfollowid}
        },{new:true}).select("-password");
        if(!loggedinuser){return res.json({status:500,error:"server error"})}
        else{return res.json(loggedinuser)}
    }
});

router.put("/updatepic",requireLogin,async(req,res)=>{
    let updateduser = await User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true});
    if(!updateduser){
        return res.json({
            status:422,
            error:"server error"
        });
    }else{
        return res.json(updateduser);
    }

})

module.exports = router;