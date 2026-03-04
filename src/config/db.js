const mongoose = require("mongoose");
const connectToDb = async () =>{
   try{
     await mongoose.connect(process.env.DB_CONNECTION_REQUEST);
     console.log("Connected to cluster");
   }
   catch(err){
    console.error(err.message)
   }
}
module.exports = connectToDb;