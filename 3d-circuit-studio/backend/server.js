const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/projects', projectRoutes);

// Serve static frontend files
const rootDir = path.join(__dirname, '../');
app.use(express.static(rootDir));

// SPA fallback for root index
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Next-Generation 3D Circuit Studio Backend Live`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📡 API Base Endpoint: http://localhost:${PORT}/api/projects`);
  console.log(`====================================================`);
});
