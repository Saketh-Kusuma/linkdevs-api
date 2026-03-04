const {Schema, model} = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = new Schema({
    firstName: {type:String,required:true,trim:true,minLength:2},
    lastName: {type:String,trim:true},
    emailId:{type:String,required:true,unique:true,lowercase:true,trim:true,validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error("Email is not valid")
        }
    }},
    password:{type:String,required:true,trim:true,minLength:6,validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Enter a strong Password")
        }
    }},
    age:{type:Number,required:true,min:18},
    gender:{type:String,enum:{
        values:["male","female","other"],
        message:`{VALUE} is not supported`
    },lowercase:true},
    photoUrl:{
        type:String,
        validate(value)
        {
            if(!validator.isURL(value))
            {
                throw new Error("Invalid URL")
            }
        },required:true
    },
    about:{
        type:String,
        default:`This is a default about of the user `
    },
    skills:{
        type:[String],
        validate: [arr => arr.length <= 20, 'Maximum 20 skills allowed']
    }
},
{
    timestamps:true
})
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
} 
userSchema.methods.getPasswordStatus = async function (password)
{
    const user = this
    const isPasswordValid = await bcrypt.compare(password,user.password)
    return isPasswordValid;
}
const User = new model("User",userSchema);
module.exports = User;