// controllers/shopStateController.js
const pool = require('../database/index');

const ShopState = require('../models/ShopState');

const shopStateController = {
  getShopState: async (req, res) => {
    try {
        const withdrawalId = 1; // Change this to the desired ID
  
        // Execute SQL SELECT statement to fetch withdrawal status by ID
        const selectQuery = 'SELECT isOpen FROM ShopStates WHERE id = ?';
        const [rows, fields] = await pool.query(selectQuery, [withdrawalId]);
  
        // Send the retrieved withdrawal status as the response
        if (rows.length > 0) {
          res.status(200).json({ isOpen: rows[0].isOpen });
        } else {
          res.status(404).json({ error: 'shop state not found' });
        }
      } catch (error) {
        console.error('Error fetching shopstate status:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  },

  toggleShopState: async (req, res) => {
    try {
        const {isOpen } = req.body;
  
        // Execute SQL UPDATE statement to update the isAllowed field
        const updateQuery = 'UPDATE ShopStates SET isOpen = ? WHERE id = ?';
        await pool.query(updateQuery, [isOpen, 1]);
  
        res.status(200).json({ message: 'ShopStates status updated successfully' });
      } catch (error) {
        console.error('Error updating withdrawal status:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
   
  }
};

module.exports = shopStateController;
