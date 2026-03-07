import express from 'express';
import { User } from '../models/schemas/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/nodemailer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// --- REGISTER / SIGN UP ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; 

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN (WITH JWT + COOKIE) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username
    };

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.status(200).json({ 
      message: "Login Successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, isPremium: user.isPremium } 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

export function generateRandomPassword() {
  return Math.floor(
    Math.random() * (10 ** 8)
  ).toString().padStart(8, '0');
}

// --- RESET PASSWORD ---
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, passwordReset: true },
      { returnDocument: 'after' } // ✅ fixed: was { new: true }
    );

    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    await sendEmail(email, 'Password Reset KADA', `Password baru kamu: ${randomPassword}`);
    
    res.json({ result: 'success', message: "udah dikirim brok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPGRADE TO PREMIUM ---
router.put("/upgrade", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { isPremium: true },
      { returnDocument: 'after' } // ✅ already correct
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Success! User is now Pro", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Database update failed" });
  }
});

export default router;