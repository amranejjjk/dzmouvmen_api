const pool = require('../database/index');

const coinsController = {


// this function for updating Quantity from table CoinsQuantities
  toggleCoinsQuantity: async (req, res) => {
    try {
      const {quantity } = req.body;

      if (!quantity) {
        return res.status(400).json({ error: 'quantity are required' });
      }

      // Execute SQL UPDATE statement to update the isAllowed field
      const updateQuery = 'UPDATE CoinsQuantities SET quantity = ? WHERE id = ?';
      await pool.query(updateQuery, [quantity, 1]);

      res.status(200).json({ message: 'quantity status updated successfully' });
    } catch (error) {
      console.error('Error updating quantity status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


// this function for getting Quantity from table CoinsQuantities
  getQuantityById: async (req, res) => {
    try {
      const quantityId = 1; // Change this to the desired ID

      // Execute SQL SELECT statement to fetch withdrawal status by ID
      const selectQuery = 'SELECT quantity FROM CoinsQuantities WHERE id = ?';
      const [rows, fields] = await pool.query(selectQuery, [quantityId]);

      // Send the retrieved withdrawal status as the response
      if (rows.length > 0) {
        res.status(200).json({ quantity: rows[0].quantity });
      } else {
        res.status(404).json({ error: 'quantity not found' });
      }
    } catch (error) {
      console.error('Error fetching quantity status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },




// this function for getting dzm value from table CoinsValues
  getcoinsValue: async (req, res) => {
    try {
      const docId = 1; // Change this to the desired ID

      // Execute SQL SELECT statement to fetch withdrawal status by ID
      const selectQuery = 'SELECT value FROM CoinsValues WHERE id = ?';
      const [rows, fields] = await pool.query(selectQuery, [docId]);

      // Send the retrieved withdrawal status as the response
      if (rows.length > 0) {
        res.status(200).json({ value: rows[0].value });
      } else {
        res.status(404).json({ error: 'value not found' });
      }
    } catch (error) {
      console.error('Error fetching coins value:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

// this function for getting dzm value from table CoinsValues
 togglecoinsValue: async (req, res) => {
    try {
      const {value } = req.body;

      if (!value) {
        return res.status(400).json({ error: 'value are required' });
      }
      // Execute SQL UPDATE statement to update the isAllowed field
      const updateQuery = 'UPDATE CoinsValues SET value = ? WHERE id = ?';
      await pool.query(updateQuery, [value, 1]);

      res.status(200).json({ message: 'value status updated successfully' });
    } catch (error) {
      console.error('Error updating value status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  // this function for getting baridmob value from table BaridmobValues
  getbaridValue: async (req, res) => {
    try {
      const docId = 1; // Change this to the desired ID

      // Execute SQL SELECT statement to fetch withdrawal status by ID
      const selectQuery = 'SELECT value FROM BaridmobValues WHERE id = ?';
      const [rows, fields] = await pool.query(selectQuery, [docId]);

      // Send the retrieved withdrawal status as the response
      if (rows.length > 0) {
        res.status(200).json({ value: rows[0].value });
      } else {
        res.status(404).json({ error: 'value not found' });
      }
    } catch (error) {
      console.error('Error fetching coins value:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

// this function for getting dzm value from table CoinsValues
 togglebaridValue: async (req, res) => {
    try {
      const {value } = req.body;

      if (!value) {
        return res.status(400).json({ error: 'value are required' });
      }
      // Execute SQL UPDATE statement to update the isAllowed field
      const updateQuery = 'UPDATE BaridmobValues SET value = ? WHERE id = ?';
      await pool.query(updateQuery, [value, 1]);

      res.status(200).json({ message: 'value status updated successfully' });
    } catch (error) {
      console.error('Error updating value status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = coinsController;
