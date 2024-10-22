const db = require('../db');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, email, password, role, branch_code, branch_name, device_number, contact_person } = req.body;

    try {
        if (req.user.role !== 'Super Admin') {
            return res.status(403).json({ error: 'Access denied. Only Super Admin can register users.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, role]
        );

        if (!newUser.rows[0]) {
            return res.status(500).json({ error: 'Failed to insert new user' });
        }

        await db.query(
            'INSERT INTO branches (branch_code, branch_name, device_number, contact_person, user_id) VALUES ($1, $2, $3, $4, $5)',
            [branch_code, branch_name, device_number, contact_person, newUser.rows[0].id]
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error in registerUser:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to register user', details: err.message });
    }
};
