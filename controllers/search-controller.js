const pool = require('../database/index');

const usersController = {
  searchByUsername: async (req, res) => {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    try {
      const [rows, fields] = await pool.query('SELECT userId, name FROM users WHERE name LIKE ?', [`${username}%`]);

      if (rows.length > 0) {
        return res.status(200).json({ users: rows });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = usersController;
