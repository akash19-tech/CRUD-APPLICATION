const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    const MONGO_URI = `${process.env.MONGO_URI}${process.env.DB_NAME}`;
    const connectionInstance = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected!! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with a failure
  }
};

module.exports = connectDB;
