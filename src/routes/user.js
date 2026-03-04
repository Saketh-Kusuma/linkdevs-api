const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewears/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName","lastName","photoUrl","age","about","gender"]
userRouter.get("/requests/received",userAuth,async (req,res)=>{
    try{
       const user = req.user;
       const connections = await ConnectionRequestModel.find({
        toUserId:user._id,
        status:"interested"
       }).populate("fromUserId",USER_SAFE_DATA)
     res.json({data:connections})
    }
    catch(err){
        res.status(400).send("Something Went Wrong")
    }
})
userRouter.get("/connections",userAuth,async (req,res)=>{
    try{
       const user = req.user;
       
       const connections = await ConnectionRequestModel.find({
        $or:[{fromUserId:user._id,status:"accepted"},{toUserId:user._id,status:"accepted"}],
       }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
         const data = connections.map((field)=>{
            if(field.fromUserId==user._id)
            {
                return field.toUserId
            }
            return field.fromUserId
         })
         console.log(data)
       res.json({data})
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const user = req.user
        const connections = await ConnectionRequestModel.find({$or:[{toUserId:user._id},{fromUserId:user._id}]}).select("fromUserId toUserId");
       const hiddenUserInFeed = new Set();
const page = parseInt(req.query.page)||1;
       let limit = parseInt(req.query.limit)||10;
       limit = limit>50?50:limit
       if(limit)
       connections.forEach((request) => {
        hiddenUserInFeed.add(request.fromUserId.toString());
        hiddenUserInFeed.add(request.toUserId.toString());
       });
       const feedData = await User.find(
        {
           $and:[
            {_id:{$nin:Array.from(hiddenUserInFeed)}},
            {_id:{$ne:user._id}}
        ]
        },
    ).select(USER_SAFE_DATA).skip((page-1)*limit).limit(limit)
        res.json({
            data: feedData
        })
    }
    catch(err){
        res.status(400).send("Error: "+err.meesage)
    }
})
module.exports = userRouter;