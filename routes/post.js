const router = require("express").Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");


router.get("/allpost",requireLogin,async(req,res)=>{
    let post = await Post.find().populate("postedBy comments.postedBy");
    if(post){
        res.json({posts:post});
    }
})

router.get("/getsubpost",requireLogin,async(req,res)=>{
    let post = await Post.find({postedBy:{$in:req.user.following}}).populate("postedBy comments.postedBy");
    if(post){
        res.json({posts:post});
    }
})

router.get("/mypost",requireLogin,async(req,res)=>{
    let posts = await Post.find({postedBy:req.user._id}).populate("postedBy _id name");
    if(posts){
        res.json({post:posts});
    }
});

router.post("/createpost",requireLogin, async(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.json({status:422,error:"Please add all the fields."});
    }
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user
    });
    let newpost = await post.save();
    if(newpost){
        res.json({post:newpost}); 
    }
});

router.put("/like",requireLogin, async(req,res)=>{
    // let updatedpost = await Post.updateOne({_id:req.body.postid},{
    //     $push:{likes:req.user._id}
    // },{upsert:true});
    let updatedpost = await Post.findOneAndUpdate({_id:req.body.postid},{
        $push:{likes:req.user._id},
    },{new:true}).populate("postedBy");
    if(!updatedpost){
        return res.json({
            status:422,
            error:"server error"
        });
    }else{
        // console.log(updatedpost);
        return res.json(updatedpost);
    }
})

router.put("/unlike",requireLogin, async(req,res)=>{
    let updatedpost = await Post.findOneAndUpdate({_id:req.body.postid},{
        $pull:{likes:req.user._id}
    },{new:true}).populate("postedBy");
    if(!updatedpost){
        return res.json({
            status:422,
            error:"server error"
        });
    }else{
        return res.json(updatedpost);
    }
})

router.put("/comments",requireLogin, async(req,res)=>{
    // console.log(typeof(req.body.text));
    let comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    let updatedpost = await Post.findOneAndUpdate({_id:req.body.postid},{
        $push:{comments:comment},
    },{new:true}).populate("comments.postedBy");
    if(!updatedpost){
        return res.json({
            status:422,
            error:"server error"
        });
    }else{
        // console.log(updatedpost);
        return res.json(updatedpost);
    }
})

router.delete("/delete/:postid",requireLogin,async(req,res)=>{
    const {postid} =req.params;
    Post.findOne({_id:postid}).populate("postedBy","_id name")
    .exec((err,post)=>{
        if(err ||!post){
            return res.json({status:422,error:err});
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({
                    data:result
                });
            })
            .catch((err)=>{
                console.log(err);
                res.json({status:500,error:"server error"});
            })
        }
    })
})

router.post("/deletecomment",requireLogin,async(req,res)=>{
    // postid,postedbyid, text
    const {postid, postedByid,comment_id} = req.body;
    console.log(comment_id)
    Post.findOneAndUpdate({_id:postid},{
        $pull:{"comments":{"postedBy":postedByid,"_id":comment_id}}
    },{new:true}).populate("postedBy","_id name").populate("comments.postedBy","_id name")
    .then((post)=>{
        // console.log(post);
        return res.json({
            status:200,
            message:"successfully deleted",
            data:post
        });
    })
    .catch((err)=>{
        console.log(err);
        return res.json({status:500,error:"server error"});
    })
});

module.exports =router;