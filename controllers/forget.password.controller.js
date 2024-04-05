const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool=require('../database/index');
const emailservice=require('../EmailService/emailService');
const { log } = require('console');
require('dotenv').config();


const passwordController={


    forgetpassword:async (req,res)=>{
        const { email } = req.body;

        try {
        // Check if the user exists in the database
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (rows.length === 0) {
               return res.status(404).json({ error: 'User not found' });
            }

           // Generate reset token
           const resetToken = crypto.randomBytes(20).toString('hex');

           // Update the user's record in the database with the reset token
           await pool.query('UPDATE users SET reset_token = ? WHERE email = ?', [resetToken, email]);

           // Send an email with the reset link containing the token
           const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user:process.env.EMAIL , // Your Gmail email address
              pass:  process.env.PASSWORD// Your Gmail password or an app-specific password
            }
           });
        // generatePasswordResetEmail is function for sending email and make html design 
            await transporter.sendMail(emailservice.generatePasswordResetEmail(email,resetToken));
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error in forgot password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

   },
   // this function for reset password


   resetPassword:async(req,res)=>{
        const { resetToken, newPassword } = req.body;
        
    try {
        // Find the user with the provided reset token
        const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ?', [resetToken]);
        if (rows.length === 0) {
           return res.status(404).json({ error: 'Invalid or expired reset token' });
        }

        // Update the user's password and clear the reset token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?', [hashedPassword, resetToken]);
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ error: 'Internal server error' });
  }
   }
}
module.exports=passwordController;