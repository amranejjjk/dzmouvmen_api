const pool = require('../database/index');

const transferController = {


  // this mothde allowed users to send coins between them

  transferCoins: async (req, res) => {
    const { fromuserId, touserId, coins } = req.body;

    if (!fromuserId || !touserId || !coins) {
      return res.status(400).json({ error: 'From referral link, to referral link, and coins are required' });
    }

    try {
      // Get user IDs from referral links
      const [fromUserRows] = await pool.query('SELECT userId FROM users WHERE userId = ?', [fromuserId]);
      const [toUserRows] = await pool.query('SELECT userId FROM users WHERE userId = ?', [touserId]);

      if (fromUserRows.length === 0 || toUserRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const fromUserId = fromUserRows[0].userId;
      const toUserId = toUserRows[0].userId;

      // Check if the sender has enough coins
      const [senderRows] = await pool.query('SELECT coins FROM users WHERE userId = ?', [fromUserId]);
      const senderCoins = senderRows[0].coins;

      if (senderCoins < coins) {
        return res.status(400).json({ error: 'Insufficient coins' });
      }

      // Deduct coins from the sender
      await pool.query('UPDATE users SET coins = coins - ? WHERE userId = ?', [coins, fromUserId]);

      // Add coins to the receiver
      await pool.query('UPDATE users SET coins = coins + ? WHERE userId = ?', [coins, toUserId]);

      return res.status(200).json({ message: 'Coins transferred successfully' });
    } catch (error) {
      console.error('Error transferring coins:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = transferController;
