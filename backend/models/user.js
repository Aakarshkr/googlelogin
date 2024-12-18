import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensure the email is unique
      lowercase: true,
      validate: {
        validator: function (v) {
          // Regular expression to validate email format
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,  // Ensure phone number is unique
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce minimum password length
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);



// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
