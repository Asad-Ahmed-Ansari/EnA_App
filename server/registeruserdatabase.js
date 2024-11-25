const bcrypt = require('bcrypt');
const pool = require('./db'); // Ensure this path is correct

const addUser = async () => {
  const username = 'waqas';
  const email = 'waqas123@gmail.com';
  const password = 'waqas123'; // Plain text password

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)', 
      [username, email, hashedPassword, ' Admin']);

    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

addUser();
