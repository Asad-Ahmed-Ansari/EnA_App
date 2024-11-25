const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:branchName', authenticateToken, async (req, res) => {
  const { branchName } = req.params;

  if (!branchName) {
    return res.status(400).json({ message: "Branch name is required" });
  }

  try {
    const query = `
      SELECT sr.* 
      FROM "siterecord" sr
      JOIN devices d ON sr.deviceid = d.device_number
      JOIN sites s ON d.site_id = s.id
      WHERE s.branch_name = $1;
    `;

    const deviceData = await pool.query(query, [branchName]);

    if (deviceData.rows.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.json(deviceData.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
