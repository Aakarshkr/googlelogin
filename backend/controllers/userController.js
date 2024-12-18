import dotenv from "dotenv";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
dotenv.config();

// User Registration
export const register = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  try {
    // Check if email or phoneNumber already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or phone number already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password: ", hashedPassword);

    // Create the user
    const user = new User({ username, email, phoneNumber, password: hashedPassword });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Error registering user", error: err.message });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res
      .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "Error logging in", error: err.message });
  }
};

// Send Reset Email
export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click this <a href="${resetLink}">link</a> to reset your password. This link is valid for 1 hour.</p>`,
    });

    return res.status(200).json({ success: true, message: "Reset email sent successfully" });
  } catch (err) {
    console.error("Error sending reset email:", err.message);
    return res.status(500).json({ success: false, message: "Error sending reset email", error: err.message });
  }
};

// Verify Reset Token
export const verifyResetToken = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Check if token is valid
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    res.status(200).json({ success: true, message: "Token is valid" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error verifying token", error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Token must be valid and not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null; // Clear reset token
    user.resetTokenExpires = null; // Clear reset token expiration
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ success: false, message: "Error resetting password", error: err.message });
  }
};
