require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Import pg
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to save token to the database
async function saveTokenToDatabase(userId, token) {
    const query = 'INSERT INTO user_tokens (user_id, token) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET token = $2';
    const values = [userId, token];

    try {
        await pool.query(query, values);
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token to database:', error);
    }
}

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized if no token

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user;

        // Save the token in the database
        await saveTokenToDatabase(user.id, token); // Adjust user.id according to your user object structure

        next();
    });
}

module.exports = authenticateToken;
