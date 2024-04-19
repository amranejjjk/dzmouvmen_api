const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../database/index');
const nodemailer = require('nodemailer');
require('dotenv').config();
const emailservice=require('../EmailService/emailService');






const usersController = {
  
  
  signIn: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Check if user with the provided email exists
      const [rows, fields] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // add this update 
      if (user.verrified===0) {
        return res.status(401).json({ error: 'Please Verrifie Your Email Adress' });
      }
      

      // Generate JWT token
      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);

      res.status(200).json({ message: 'Login successful',token:token ,user:user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
 
/// signUp methode


  signUp: async (req, res) => {
    const { name, email, password, refral_link } = req.body;
    let coins = 0;
    let referrerExists=false;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
      if (refral_link) {
         referrerExists = await findUserById(refral_link);
        coins = referrerExists ? 10 : 0;

      }

      const [rows, fields] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (name, email, password, userId, coins) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, userId, coins]);
      // update other user coins with refral_link 
      referrerExists ? await updateUserCoinsById(refral_link):null
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:process.env.EMAIL , // Your Gmail email address
          pass:  process.env.PASSWORD// Your Gmail password or an app-specific password
        }
       });
      await transporter.sendMail(emailservice.generateVerrificationEmail(email));
      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  // this methode to update user coins 

  updateUserCoins: async (req, res) => {
    const { userId, coinsToAdd } = req.body;
  
    try {
      // Get current user's coins
      const [userData] = await pool.query('SELECT coins FROM users WHERE userId = ?', [userId]);
      if (userData.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Convert current coins to a numeric type
      const currentCoins = parseInt(userData[0].coins); // Assuming coins are stored as integers
  
      // Check if current coins are a valid number
      if (isNaN(currentCoins)) {
        return res.status(500).json({ success: false, message: 'Invalid current coins value' });
      }
  
      // Add new coins to the current total
      const newCoins = currentCoins + coinsToAdd;
  
      // Update user's coins
      await pool.query('UPDATE users SET coins = ? WHERE userId = ?', [newCoins, userId]);
  
      res.status(200).json({ success: true, message: 'User coins updated successfully', newCoins });
    } catch (error) {
      console.error('Error updating user coins:', error);
      res.status(500).json({ success: false, message: 'Failed to update user coins' });
    }
  },
  
  getUserCoins: async (req, res) => {
    const { userId } = req.body;

    try {
      // Query to get user's coins
      const [rows] = await pool.query('SELECT coins FROM users WHERE userId = ?', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const userCoins = rows[0].coins;

      res.status(200).json({ success: true, coins: userCoins });
    } catch (error) {
      console.error('Error fetching user coins:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  decreaseUserCoins: async (req, res) => {
    const { userId, coinsToSubtract } = req.body;
  
    try {
      // Get current user's coins
      const [userData] = await pool.query('SELECT coins FROM users WHERE userId = ?', [userId]);
      if (userData.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Convert current coins to a numeric type
      const currentCoins = parseInt(userData[0].coins); // Assuming coins are stored as integers
  
      // Check if current coins are a valid number
      if (isNaN(currentCoins)) {
        return res.status(500).json({ success: false, message: 'Invalid current coins value' });
      }
  
      // Ensure sufficient coins for subtraction
      if (currentCoins < coinsToSubtract) {
        return res.status(400).json({ success: false, message: 'Insufficient coins' });
      }
  
      // Subtract coins from the current total
      const newCoins = currentCoins - coinsToSubtract;
  
      // Update user's coins
      await pool.query('UPDATE users SET coins = ? WHERE userId = ?', [newCoins, userId]);
  
      res.status(200).json({ success: true, message: 'User coins decreased successfully', newCoins });
    } catch (error) {
      console.error('Error decreasing user coins:', error);
      res.status(500).json({ success: false, message: 'Failed to decrease user coins' });
    }
  },

   getAllUsersExceptCurrentUser : async (req, res) => {
    try {
      const userId = req.user.userId; // Assuming you have middleware to extract current user's ID from JWT
  
      // Query all users except the current user
      const [users] = await pool.query('SELECT userId, name FROM users WHERE userId != ?', [userId]);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async  updateUserVerificationStatus(email) {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Run the query to update verrified status
        const [rows, fields] = await connection.execute(
            'UPDATE users SET verrified = 1 WHERE email = ?',
            [email]
        );

        // Release the connection back to the pool
        connection.release();

        console.log(`Updated verification status for email ${email}`);
        return true; // Indicate successful update
    } catch (error) {
        console.error('Error updating verification status:', error);
        throw error; // Throw error for handling at a higher level
    }
}

};



// find user by userId


async function findUserById(userId) {
  if (!userId) {
    return false;
  } else {
    try {
      const [rows, fields] = await pool.query('SELECT * FROM users WHERE userId = ?', [userId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return false;
    }
  }
};

// this function for updating user coins using userId


async function updateUserCoinsById(userId) {
  try {
    // Check if the user exists
    const [rows, fields] = await pool.query('SELECT * FROM users WHERE userId = ?', [userId]);
    if (rows.length === 0) {
      console.log('User not found');
      return; // Return early if user not found
    }
    
    // Update the user's coins by adding 2
    await pool.query('UPDATE users SET coins = coins + 3 WHERE userId = ?', [userId]);
    console.log('User coins updated successfully');
  } catch (error) {
    console.error('Error updating user coins:', error);
  }
}


module.exports = usersController;
