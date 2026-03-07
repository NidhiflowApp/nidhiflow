const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, "Please provide valid email"]
},

    password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [8, "Password must be at least 8 characters"]
},

 
isVerified: {
  type: Boolean,
  default: false,
},
resetPasswordToken: {
  type: String,
},
resetPasswordExpire: {
  type: Date,
},

verificationToken: {
  type: String,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);