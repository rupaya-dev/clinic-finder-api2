const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

// Enhanced CORS for Render
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-app.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB Connection - ONLY from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Clinic Schema (same as before)
const clinicSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  contact: String,
  email: String,
  doctors: [{
    name: String,
    specialization: String,
    experience: Number,
    qualification: String,
    consultation_fee: Number,
    availability: [String]
  }]
});

const Clinic = mongoose.model('Clinic', clinicSchema);

// API endpoints (same as before)
// ...

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Clinic Finder API',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Clinic Finder API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: 'https://github.com/your-username/clinic-finder-api',
    endpoints: {
      health: 'GET /health',
      getAllClinics: 'GET /api/clinics?city={city}',
      getClinicById: 'GET /api/clinics/{id}',
      // ... other endpoints
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
