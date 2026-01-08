const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json()); 
app.use(cors());         

// 1. User Schema (otp field added)
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: String,
    otp: String  
});

const User = mongoose.model('User', userSchema);

// 2. Nodemailer Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sastikapalanisamy@gmail.com', 
        pass: 'ghbdpydzvinodlte' 
    }
});

// 3. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/civic_db')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err));

// --- ROUTES ---

// Registration
app.post('/register', async (req, res) => {
    try {
        await new User(req.body).save();
        res.status(201).json({ status: 'ok' });
    } catch (err) { res.status(400).json({ status: 'error' }); }
});

// Login
app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    user ? res.json({ status: 'ok' }) : res.status(401).json({ status: 'error' });
});

// FORGOT PASSWORD (Fixed with Registration Check)
app.post('/forgot-password', async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        
        // Step 1: Search for user in Database
        const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });

        // Step 2: User illana, ingaiye stop panniduvom (No Email Sent)
        if (!user) {
            console.log("❌ Unauthorized attempt for email:", email);
            return res.status(404).json({ 
                status: 'error', 
                message: "This email is not registered. Please register first!" 
            });
        }

        // Step 3: User irundha mattum OTP generate pannurom
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = generatedOtp;
        await user.save();

        const mailOptions = {
            from: 'sastikapalanisamy@gmail.com',
            to: email,
            subject: 'CIVIX - Password Reset OTP',
            html: `<h3>CIVIX Security</h3>
                   <p>Your OTP for resetting the password is:</p>
                   <h1 style="color: #082435;">${generatedOtp}</h1>
                   <p>This is for registered users only. Do not share it.</p>`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ status: 'error' });
            res.json({ status: 'ok', message: "OTP sent successfully!" });
        });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

// VERIFY OTP & UPDATE PASSWORD
app.post('/reset-password-otp', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email: email.trim().toLowerCase(), otp: otp });

        if (!user) {
            return res.status(400).json({ status: 'error', message: "Invalid OTP or Email!" });
        }

        user.password = newPassword;
        user.otp = undefined; 
        await user.save();

        res.json({ status: 'ok', message: "Password updated!" });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

app.listen(5000, () => console.log("🚀 Server running on Port 5000"));