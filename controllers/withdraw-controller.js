const pool = require('../database/index');

const withdrawalController = {
  // Lock or unlock a withdrawal
  toggleWithdrawalStatus: async (req, res) => {
    try {
      const {isAllowed } = req.body;

      // Execute SQL UPDATE statement to update the isAllowed field
      const updateQuery = 'UPDATE Withdrawals SET isAllowed = ? WHERE id = ?';
      await pool.query(updateQuery, [isAllowed, 1]);

      res.status(200).json({ message: 'Withdrawal status updated successfully' });
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getWithdrawalStatusById: async (req, res) => {
    try {
      const withdrawalId = 1; // Change this to the desired ID

      // Execute SQL SELECT statement to fetch withdrawal status by ID
      const selectQuery = 'SELECT isAllowed FROM Withdrawals WHERE id = ?';
      const [rows, fields] = await pool.query(selectQuery, [withdrawalId]);

      // Send the retrieved withdrawal status as the response
      if (rows.length > 0) {
        res.status(200).json({ isAllowed: rows[0].isAllowed });
      } else {
        res.status(404).json({ error: 'Withdrawal not found' });
      }
    } catch (error) {
      console.error('Error fetching withdrawal status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = withdrawalController;
