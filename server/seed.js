const db = require('./db');
const bcrypt = require('bcrypt');

const insertData = async () => {
  try {
    // Insert into sites table
    await db.query(`
      INSERT INTO sites (branch_code, branch_name, logo_url, contact_person, contact_phone, contact_email)
      VALUES ('BC789', 'gulshan Branch', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bankislami_logo_without_Motive.png/800px-Bankislami_logo_without_Motive.png', 'Ali', '111-983-5980', 'ali123@example.com')
    `);

    // Get the inserted site's id
    const siteResult = await db.query(`SELECT id FROM sites WHERE branch_code = 'BC789'`);
    const siteId = siteResult.rows[0].id;

    // Insert into devices table using the inserted site's id
    await db.query(`
      INSERT INTO devices (device_number, site_id, device_details)
      VALUES ('D789', $1, 'Device details for gulshan Branch')
    `, [siteId]);

    // Get the inserted device's id
    const deviceResult = await db.query(`SELECT id FROM devices WHERE device_number = 'D789'`);
    const deviceId = deviceResult.rows[0].id;

    // Hash the password
    const plainPassword = 'ali123'; // Replace with your actual password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert into users table using the inserted site's id and device's id
    await db.query(`
      INSERT INTO users (username, email, password, role, site_id, device_id)
      VALUES ('Ali', 'ali123@example.com', $1, 'User', $2, $3)
    `, [hashedPassword, siteId, deviceId]);

    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Failed to insert data:', error);
  }
};

insertData();
