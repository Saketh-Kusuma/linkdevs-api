const express = require("express");
const { userAuth } = require("../middlewears/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { validateRequestStatusData, validateUserIdData, validateReviewStatusData, validateRequestId } = require("../utils/validations");
const requestRouter = express.Router();
requestRouter.post("/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        validateRequestStatusData(req);
        await validateUserIdData(req,user._id)
        const existingConnectionRequest = await ConnectionRequest.findOne(
            {
                $or:
                [
                    {fromUserId:user._id,toUserId:req.params.toUserId},
                    {fromUserId:req.params.toUserId,toUserId:user._id}
                ],
            }
        )
        if(existingConnectionRequest)
        {
            throw new Error("Already sent a request")
        }
        const connectionreq = new ConnectionRequest({fromUserId:user._id,toUserId:req.params.toUserId,status:req.params.status})    
        const data = await connectionreq.save()
        res.json({message:`${req.params.status} Request is Sent to ${req.params.toUserId}`,data})
    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
})
requestRouter.post("/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const user = req.user;
    validateReviewStatusData(req);
    validateRequestId(req)
    const connectionRequest = await ConnectionRequest.findOne({
        _id:req.params.requestId,
        toUserId:user._id,
        status:"interested"
    })
    if(!connectionRequest){
        throw new Error("Connection request not found")
    }
    connectionRequest.status = req.params.status;
    await connectionRequest.save();
    res.json({message:`Connection requested of ${connectionRequest.fromUserId} is ${req.params.status}`})
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
})
module.exports = requestRouter