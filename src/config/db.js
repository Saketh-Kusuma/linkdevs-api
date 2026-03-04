const mongoose = require("mongoose");

let isConnected = false;

const connectToDb = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;
  console.log("MongoDB connected");
};

module.exports = connectToDb;
