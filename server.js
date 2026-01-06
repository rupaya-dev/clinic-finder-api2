const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://haldharsinghepic_db_user:123456789101112@cluster0.tektwpr.mongodb.net/rupaya?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

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

// ✅ ADD THESE ENDPOINTS:

// 1. Get all clinics (filter by city)
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

// 2. Add sample data endpoint (for testing)
app.get('/api/seed', async (req, res) => {
  try {
    const sampleClinics = [
      {
        name: "City Hospital",
        city: "Gurugram",
        address: "Sector 14, Gurugram",
        contact: "9876543210",
        email: "contact@cityhospital.com",
        doctors: [
          {
            name: "Dr. Sharma",
            specialization: "Cardiologist",
            experience: 10,
            qualification: "MD",
            consultation_fee: 800,
            availability: ["Mon", "Wed", "Fri"]
          }
        ]
      },
      {
        name: "Medicare Clinic",
        city: "Delhi",
        address: "Connaught Place, Delhi",
        contact: "9876543211",
        email: "info@medicare.com",
        doctors: [
          {
            name: "Dr. Gupta",
            specialization: "Dermatologist",
            experience: 8,
            qualification: "MBBS, MD",
            consultation_fee: 600,
            availability: ["Tue", "Thu", "Sat"]
          }
        ]
      }
    ];
    
    await Clinic.deleteMany({});
    await Clinic.insertMany(sampleClinics);
    
    res.json({
      success: true,
      message: "Sample data added successfully",
      count: sampleClinics.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// 3. Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 4. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Clinic Finder API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 5. Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Clinic Finder API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      test: 'GET /api/test',
      getAllClinics: 'GET /api/clinics?city=cityname',
      seedData: 'GET /api/seed',
      getClinicById: 'GET /api/clinics/:id',
      getClinicDoctors: 'GET /api/clinics/:id/doctors'
    },
    instructions: 'First use /api/seed to add sample data, then use /api/clinics'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
