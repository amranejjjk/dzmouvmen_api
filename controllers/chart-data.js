

const pool = require('../database/index');


const chartController = {
  // Add a data point to the chart
  addDataPoint: async (req, res) => {
    try {
      const { x } = req.body;

      // Execute SQL INSERT statement to add a new data point
      const insertQuery = 'INSERT INTO ChartData (x, dateTime) VALUES (?, NOW())';
      await pool.query(insertQuery, [x]);

      res.status(201).json({ message: 'Data point added successfully' });
    } catch (error) {
      console.error('Error adding data point:', error);
      res.status(500).json({ error: 'Internal server error',details: error.message });
    }
  },

  // Get data for the last 7 daysx
  getLast7DaysData: async (req, res) => {
    try {
      // Calculate the date 7 days ago
      const last7DaysDate = new Date();
      last7DaysDate.setDate(last7DaysDate.getDate() - 7);

      // Execute SQL SELECT statement to fetch data points for the last 7 days
      const selectQuery = 'SELECT x, dateTime FROM ChartData WHERE dateTime >= ?';
      const [rows, fields] = await pool.query(selectQuery, [last7DaysDate]);

      // Send the retrieved data points as the response
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching data for last 7 days:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = chartController;
