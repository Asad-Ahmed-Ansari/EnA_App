const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware to check admin bank affiliation
const checkBankAffiliation = (req, res, next) => {
    if (req.user.role === 'Admin' && req.user.bank_name) {
        req.bankFilter = req.user.bank_name; // Set the bank filter for the admin
    } else {
        req.bankFilter = null; // No filter for super admin or other roles
    }
    next();
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Endpoint for fetching sites with device numbers for Super Admin
router.get('/api/sites/superadmin', async (req, res) => {
    try {
        const query = `
            SELECT 
                sites.id AS site_id, 
                sites.branch_code, 
                sites.branch_name, 
                sites.logo_url, 
                sites.contact_person,
                sites.contact_phone,
                sites.contact_email,
                sites.bank_name, 
                STRING_AGG(devices.device_number, ', ') AS device_number
            FROM sites 
            LEFT JOIN devices ON sites.id = devices.site_id
            GROUP BY 
                sites.id, 
                sites.branch_code, 
                sites.branch_name, 
                sites.logo_url, 
                sites.contact_person,
                sites.contact_phone,
                sites.bank_name, 
                sites.contact_email
            ORDER BY sites.id;
        `;
        const result = await db.query(query);
        console.log('Query Result:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get all sites (optional endpoint)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                sites.id AS site_id, 
                sites.branch_code, 
                sites.branch_name, 
                sites.logo_url, 
                sites.contact_person,
                sites.contact_phone,
                sites.contact_email,
                sites.bank_name, 
                STRING_AGG(devices.device_number, ', ') AS device_number
            FROM sites 
            LEFT JOIN devices ON sites.id = devices.site_id
            GROUP BY 
                sites.id, 
                sites.branch_code, 
                sites.branch_name, 
                sites.logo_url, 
                sites.contact_person,
                sites.contact_phone,
                sites.bank_name, 
                sites.contact_email
            ORDER BY sites.id;
        `;
        const result = await db.query(query);
        console.log('Query Result:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get contact details for a specific site
router.get('/:id/contact', async (req, res) => {
    const siteId = req.params.id;
    try {
        const result = await db.query('SELECT contact_person, contact_phone, contact_email FROM sites WHERE id = $1', [siteId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contact details' });
    }
});

// Route for AdminPage - With bank affiliation filter
router.get('/api/sites', checkBankAffiliation, async (req, res) => {
  try {
      const bankFilter = req.bankFilter;
      let query = `
          SELECT 
              sites.id AS site_id, 
              sites.branch_code, 
              sites.branch_name, 
              sites.logo_url, 
              sites.contact_person,
              sites.contact_phone,
              sites.contact_email,
              STRING_AGG(devices.device_number, ', ') AS device_number,
              sites.bank_name  -- Include bank_name in the query
          FROM sites 
          LEFT JOIN devices ON sites.id = devices.site_id
      `;
      
      if (bankFilter) {
          query += ` WHERE sites.bank_name = $1`;
      }
      
      query += `
          GROUP BY 
              sites.id, 
              sites.branch_code, 
              sites.branch_name, 
              sites.logo_url, 
              sites.contact_person,
              sites.contact_phone,
              sites.contact_email,
              sites.bank_name  -- Include bank_name in the GROUP BY clause
          ORDER BY sites.id;
      `;
      
      const result = bankFilter 
          ? await db.query(query, [bankFilter]) 
          : await db.query(query);
      
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching sites:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const siteId = parseInt(req.params.id);  // Ensure siteId is parsed as an integer
    console.log('Deleting site with ID:', siteId);  // This should log a number
  
    if (isNaN(siteId)) {
      return res.status(400).json({ message: 'Invalid site ID' });
    }
  
    try {
      await db.query('BEGIN');
      await db.query('DELETE FROM users WHERE site_id = $1', [siteId]);
      await db.query('DELETE FROM sites WHERE id = $1', [siteId]);
      await db.query('COMMIT');
  
      res.status(200).json({ message: 'Site and related users deleted successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error deleting site:', error);
      res.status(500).json({ message: 'Failed to delete site' });
    }
  });
  

module.exports = router;
