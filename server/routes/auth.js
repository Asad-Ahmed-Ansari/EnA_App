const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../db'); // Adjust the path if necessary

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET, // Replace with your JWT secret
    { expiresIn: '1h' }
  );
};

// Login route
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find user by username or email and join with the sites table to get branch_name
    const userQuery = `
      SELECT users.*, sites.branch_name
      FROM users
      LEFT JOIN sites ON users.site_id = sites.id
      WHERE users.username = $1 OR users.email = $2
    `;
    const { rows } = await pool.query(userQuery, [usernameOrEmail, usernameOrEmail]);
    const user = rows[0];

    if (user) {
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const branchName = user.branch_name;
        console.log('Branch Name from DB:', branchName);
        // Generate token and respond with token, role, and branch_name
        const token = generateToken(user);
        res.json({ token, role: user.role, branchName: user.branch_name }); // Include branchName in the response
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const saltRounds = 10; // Number of salt rounds for hashing

// Register route
router.post('/register', async (req, res) => {
  console.log('Received request body:', req.body);

  let { username, email, password, bankName, role } = req.body;

  // Normalize role for consistency (support both 'SuperAdmin' and 'Super Admin')
  const normalizedRole = role?.trim().toLowerCase() === 'superadmin' ? 'Super Admin' : role;

  // Validation based on role
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let insertUserQuery;
    let values;

    if (normalizedRole === 'Super Admin') {
      // Insert Super Admin (no bank name)
      insertUserQuery = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)';
      values = [username, email, hashedPassword, normalizedRole];
    } else if (normalizedRole === 'Admin') {
      // Insert Admin (with bank name)
      if (!bankName) {
        return res.status(400).json({ error: 'Bank name is required for Admin.' });
      }
      insertUserQuery = 'INSERT INTO users (username, email, password, role, bank_name) VALUES ($1, $2, $3, $4, $5)';
      values = [username, email, hashedPassword, normalizedRole, bankName];
    } else {
      // For 'User' role, use `contactPerson` as the `username`
      const { branchCode, branchName, deviceNumber, contactPerson, contactPhone } = req.body;

      if (!branchCode || !branchName || !deviceNumber || !contactPerson || !contactPhone) {
        return res.status(400).json({ error: 'All fields are required for regular users.' });
      }

      // Use contactPerson as the username for 'User' role
      username = contactPerson;

      // Mapping of bank names to logo URLs
      const bankLogoMap = {
        'Bank Islami': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Bankislami_logo_without_Motive.png',
        'MCB Bank': 'https://iconape.com/wp-content/files/sj/208690/png/208690.png',
        'Meezan Bank': 'https://companieslogo.com/img/orig/MEBL.PK-a35991f1.png?t=1720244492',
      };

      const normalizedBankName = bankName.trim();
      const logoUrl = bankLogoMap[normalizedBankName] || 'https://default-logo-url.com';

      // Insert the site if it doesn't exist
      let siteResult = await pool.query('SELECT * FROM sites WHERE branch_code = $1', [branchCode]);
      let site = siteResult.rows[0];

      if (!site) {
        const insertSiteQuery = 'INSERT INTO sites (branch_code, branch_name, bank_name, contact_person, logo_url, contact_phone, contact_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const insertSiteResult = await pool.query(insertSiteQuery, [branchCode, branchName, bankName, contactPerson, logoUrl, contactPhone, email]);
        site = insertSiteResult.rows[0];
      } else {
        // Update existing site with contact phone and email
        await pool.query('UPDATE sites SET contact_phone = $1, bank_name = $2, contact_email = $3 WHERE id = $4', [contactPhone, bankName, email, site.id]);
      }

      // Check if device exists
      let deviceResult = await pool.query('SELECT * FROM devices WHERE device_number = $1', [deviceNumber]);
      let device = deviceResult.rows[0];

      if (!device) {
        // Insert new device associated with the site
        const insertDeviceQuery = 'INSERT INTO devices (device_number, site_id) VALUES ($1, $2) RETURNING *';
        const insertDeviceResult = await pool.query(insertDeviceQuery, [deviceNumber, site.id]);
        device = insertDeviceResult.rows[0];
      }

      // Insert new user with role 'User'
      insertUserQuery = 'INSERT INTO users (username, email, password, role, site_id, device_id) VALUES ($1, $2, $3, $4, $5, $6)';
      values = [username, email, hashedPassword, 'User', site.id, device.id];
    }

    // Execute the query
    await pool.query(insertUserQuery, values);

    res.status(201).json({ message: `${normalizedRole} registered successfully` });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});






module.exports = router;
