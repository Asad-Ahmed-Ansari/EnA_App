const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const sitesRoutes = require('./routes/sites');
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config(); // Load environment variables

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Define routes
app.use('/api/users', usersRoutes); // Make sure this is a router
app.use('/auth', authRoutes); // Ensure this is a router
app.use('/api/sites', authenticateToken, sitesRoutes); // Ensure this is a router

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Not Found Middleware
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);


