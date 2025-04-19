const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json()); // to parse JSON bodies

// ✅ Routes
app.use('/api', routes); // All routes from routes/index.js mounted under /api

// ✅ Fallback route for unmatched paths (optional)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
