const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const randomString = require("random-string-generator");
const nodemailer = require('nodemailer');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ err: 300, msg: 'User Not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(200).json({ err: 300, msg: 'Incorrect password' });
        }

        const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
            expiresIn: '24h',
        });
        res.status(200).json({ err: 200, msg: 'User logged in successfully', data: user, token });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
};

exports.signUp = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        let existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ err: 300, msg: 'User already exists, please log in to continue' });
        }
        let adminExists = await UserModel.findOne({ isAdmin });
        if (adminExists) {
            return res.status(200).json({ err: 300, msg: 'You cannot add another admin' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });
        let dataSaved = await newUser.save();
        res.status(200).json({ err: 200, msg: 'User registered successfully', data: dataSaved });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
};

exports.forgotPass = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ err: 300, msg: 'User not found' });
        }
        const resetToken = randomString(20)

        user.resetToken = resetToken;
        await user.save();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'austyn.buckridge5@ethereal.email',
                pass: 'mr4heN1qfdKd8kt8Fj'
            }
        });
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            html: `
              <p>You have requested a password reset for your account.</p>
              <p>Click <a href="http://localhost:3000/reset-password/${resetToken}"> here </a> to reset your password.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Failed to send email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ err: 200, msg: 'Please check your email' });
            }
        });

    } catch (error) {
        res.status(500).json({ err: 500, msg: err.toString() })
    }
}

exports.resetPass = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await UserModel.findOne({ resetToken: token });
        if (!user) {
            return res.status(200).json({ err: 300, msg: 'This link is invalid' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();
        res.status(200).json({ err: 200, msg: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
};