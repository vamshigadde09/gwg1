const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    // Optional: Set Mongoose options (if needed)
    mongoose.set("strictQuery", false);

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.bgGreen.white);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.bgRed.white);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
