const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB Connection with better timeout settings
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://haldharsinghepic_db_user:123456789101112@cluster0.tektwpr.mongodb.net/rupaya?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err.message));

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

// Database test endpoint
app.get('/api/db-status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  let status = '';
  
  switch(dbState) {
    case 0: status = 'disconnected'; break;
    case 1: status = 'connected'; break;
    case 2: status = 'connecting'; break;
    case 3: status = 'disconnecting'; break;
  }
  
  res.json({
    database: {
      status: status,
      state: dbState,
      connection: MONGODB_URI.replace(/\/\/.*@/, '//****:****@') // Hide credentials
    }
  });
});

// 1. Get all clinics (filter by city if provided)
app.get('/api/clinics', async (req, res) => {
  try {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
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

// REST OF YOUR ENDPOINTS REMAIN THE SAME...
// (Copy all your existing endpoints here)
// ...

// 9. Root endpoint for API info
app.get('/', (req, res) => {
  res.json({
    message: 'Clinic Finder API',
    version: '1.0.0',
    port: PORT,
    databaseStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      databaseStatus: 'GET /api/db-status',
      getAllClinics: 'GET /api/clinics?city={city}',
      getClinicById: 'GET /api/clinics/{id}',
      getClinicDoctors: 'GET /api/clinics/{id}/doctors?specialization={spec}',
      searchDoctorsInClinic: 'GET /api/clinics/{id}/doctors/search?specialization={spec}',
      searchAllDoctors: 'GET /api/doctors/search?specialization={spec}&city={city}',
      addClinic: 'POST /api/clinics',
      addDoctorsToClinic: 'POST /api/clinics/{id}/doctors',
      searchDoctorsPost: 'POST /api/clinics/search-doctors'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📊 DB Status: http://localhost:${PORT}/api/db-status`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});
