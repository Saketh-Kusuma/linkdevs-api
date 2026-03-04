const mongoose = require("mongoose");
const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{VALUE} is not supported`
        }
    }
},{timestamps:true})
connectionSchema.index({fromUserId:1,toUserId:1})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionSchema)
module.exports = ConnectionRequestModel