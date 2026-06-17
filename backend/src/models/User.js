import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      sparse: true // Allows multiple null values but only one unique
    },
    password: { 
      type: String,
      default: null 
    },
    githubId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    githubUsername: { 
      type: String 
    },
    avatar: { 
      type: String 
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

// Remove duplicate email error handling
userSchema.post("save", function(error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern?.email) {
      next(new Error("Email already exists. Please use a different email or login."));
    } else if (error.keyPattern?.githubId) {
      next(new Error("GitHub account already linked. Please login."));
    }
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;