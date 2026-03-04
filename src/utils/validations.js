const validator = require("validator");
const User = require("../models/user")
const validateSignupData = (data) => {
    if(!data.firstName.length>2)
    {
        throw new Error("First Name is too Small")
    }
     else if(!data.lastName.length >= 1)
    {
        throw new Error("First Name is too Small")
    }
    else if (!validator.isStrongPassword(data.password)){
        throw new Error("Enter a strong password")
    }
    else if (!validator.isEmail(data.emailId)){
        throw new Error("Enter a valid email address")
    }
}
const validateEditProfileData = (req) => {
    const ALLOWED_FIELDS = ["firstName","lastName","age","about","skills","photoUrl","gender"];
    const isEditAllowed = Object.keys(req.body).every((field)=>ALLOWED_FIELDS.includes(field));
    if(!isEditAllowed)
    {
        throw new Error("Something went wrong")
    }
}
const validateEditPasswordData = (req) =>{
    const ALLOWED_FIELDS = ["oldPassword","newPassword"];
    const isEditAllowed = Object.keys(req.body).every((field)=>ALLOWED_FIELDS.includes(field));
    if(!isEditAllowed)
    {
        throw new Error("Something went wrong")
    }
}
const validateRequestStatusData = (req) => {
    const ALLOWED_STATUS = ["ignored","interested"]
    if(!ALLOWED_STATUS.includes(req.params.status)){
        throw new Error("Wrong API Call")
    }
}
const mongoose = require("mongoose");

const validateUserIdData = async (req,userId) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.toUserId)) {
        throw new Error("Invalid Request");
    }
    if(req.params.toUserId==userId)
    {
        throw new Error("Cant send to yourself")
    }
    const isUserPresent = await User.findOne({ _id: req.params.toUserId });
    if (!isUserPresent) {
        throw new Error("No user found");
    }
}
const validateReviewStatusData = (req) => {
   const ALLOWED_STATUS = ["rejected","accepted"]
    if(!ALLOWED_STATUS.includes(req.params.status))
    {
        throw new Error("Not a valid status type")
    }
}
const validateRequestId = (req) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.requestId))
    {
        throw new Error("requestId is not valid")
    }
}
module.exports = {validateSignupData,validateEditProfileData,validateEditPasswordData,validateRequestStatusData,validateUserIdData,validateReviewStatusData,validateRequestId}