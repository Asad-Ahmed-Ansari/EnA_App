const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path to your actual database connection file
const authenticateToken = require('../middleware/authMiddleware');

// Endpoint to fetch user data
router.get('/data', async (req, res) => {
  try {
    // Fetch user data logic goes here, adjust query as needed
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch user data
router.get('/user-info', authenticateToken, async (req, res) => {
  try {
    // Assuming you have a table named 'users' in your database
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bank: user.bank_name }); // Adjust according to your user schema
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const getUserRoleFromDatabase = async (userId) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0].role;
  } catch (error) {
    throw new Error('Error fetching user role');
  }
};

// Fetch user role example
router.get('/role', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated with authenticated user info

    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    // Fetch user role from the database
    const userRole = await getUserRoleFromDatabase(userId);
    res.json({ role: userRole });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).send('Error fetching user role');
  }
});


module.exports = router;



