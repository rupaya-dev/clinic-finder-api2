const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://haldharsinghepic_db_user:123456789101112@cluster0.tektwpr.mongodb.net/rupaya?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err.message));

// Clinic Schema
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

// 1. Get all clinics
app.get('/api/clinics', async (req, res) => {
  try {
    const { city } = req.query;
    
    let query = {};
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }
    
    const clinics = await Clinic.find(query);
    
    res.json({
      success: true,
      total: clinics.length,
      clinics: clinics.map(clinic => ({
        id: clinic._id,
        name: clinic.name,
        city: clinic.city,
        address: clinic.address,
        contact: clinic.contact,
        email: clinic.email,
        totalDoctors: clinic.doctors.length,
        doctors: clinic.doctors
      }))
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// 2. Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    service: 'Clinic Finder API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 3. Health check (for Render)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Clinic Finder API on Render',
    timestamp: new Date().toISOString()
  });
});

// 4. Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Clinic Finder API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      test: 'GET /api/test',
      getClinics: 'GET /api/clinics?city=cityname',
      getClinicById: 'GET /api/clinics/:id',
      getClinicDoctors: 'GET /api/clinics/:id/doctors',
      searchDoctors: 'GET /api/doctors/search?specialization=spec&city=city'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
