import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB Connected Successfully");
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message);
    console.log("⚠️  Server will start without database connection");
    console.log("   MongoDB is optional for frontend testing");
    console.log("   Install MongoDB to enable full backend functionality:");
    console.log("   https://www.mongodb.com/docs/manual/installation/");
    // Don't exit - allow server to start for frontend development
  }
};

export default connectDB;