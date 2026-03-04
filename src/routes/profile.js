const express = require("express");
const { userAuth } = require("../middlewears/auth");
const User = require("../models/user"); 
const { validateEditProfileData, validateEditPasswordData } = require("../utils/validations");
const bcrypt = require("bcrypt")
const profileRouter = express.Router();
profileRouter.get("/view",userAuth,async (req,res)=>{
    try{
           const user = req.user
            res.send(user)
    }
    catch(err){
        res.status(404).send("Login or Signup required")
    }
})
profileRouter.patch("/edit",userAuth, async(req,res)=>{
    try{

        const user = req.user;
        validateEditProfileData(req);
        Object.keys(req.body).forEach((key)=>user[key] = req.body[key]);
        await user.save()
        res.json({
            message:`${user.firstName}, your profile is updated successfuly`,
            data:user
        });
    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }

})
profileRouter.patch("/password",userAuth,async(req,res)=>{
   try{
    const user = req.user;
    const {oldPassword,newPassword} = req.body;
    validateEditPasswordData(req)
    const isOldPasswordValid = await bcrypt.compare(oldPassword,user.password);
    if(!isOldPasswordValid)
    {
        throw new Error("Old password is incorrect")
    }
const newHashedPassword = await bcrypt.hash(newPassword,10);
user.password = newHashedPassword;
await user.save();
res.json({
    message:`${user.firstName} your password is updated successfuly`
})
   }
   catch(err){
    res.status(400).send("Error: "+err.message)
   }
})
module.exports = profileRouter 