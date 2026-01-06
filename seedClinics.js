const mongoose = require('mongoose');
require('dotenv').config();

// Clinic Schema
const clinicSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  contact: String,
  email: String,
  specialization: [String],
  doctors: [
    {
      name: String,
      specialization: String,
      experience: Number,
      qualification: String,
      consultation_fee: Number,
      availability: [String]
    }
  ]
});

const Clinic = mongoose.model('Clinic', clinicSchema);

// Specialization lists for different cities
const citySpecializations = {
  "Mathura": ["Cardiology", "General Medicine", "Orthopedics", "Pediatrics", "Ayurveda"],
  "Lucknow": ["Cardiology", "Orthopedics", "Neurology", "Dermatology", "ENT"],
  "Delhi": ["Oncology", "Cardiology", "Neurology", "Orthopedics", "General Surgery", "Pediatrics", "Gynecology"],
  "Mumbai": ["Oncology", "Cardiology", "Nephrology", "Urology", "Plastic Surgery", "Dermatology"],
  "Pune": ["Orthopedics", "Pediatrics", "General Medicine", "Dermatology", "ENT"],
  "Bangalore": ["Cardiology", "Neurology", "Orthopedics", "Nephrology", "Urology", "Oncology"],
  "Jaipur": ["General Medicine", "Orthopedics", "Pediatrics", "Gynecology", "Ayurveda"],
  "Hyderabad": ["Cardiology", "Nephrology", "Orthopedics", "General Surgery", "ENT"],
  "Chandigarh": ["Orthopedics", "Cardiology", "Neurology", "Dermatology", "Pediatrics"],
  "Nagpur": ["General Medicine", "Pediatrics", "Orthopedics", "Gynecology", "ENT"],
  "Gurugram": ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Plastic Surgery"],
  "Varanasi": ["General Medicine", "Ayurveda", "Orthopedics", "Pediatrics", "Homeopathy"]
};

// Sample doctors data
const sampleDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    experience: 12,
    qualification: "MBBS, MD",
    consultation_fee: 800,
    availability: ["Monday", "Wednesday", "Friday"]
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Orthopedic",
    experience: 8,
    qualification: "MBBS, MS",
    consultation_fee: 700,
    availability: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    name: "Dr. Amit Patel",
    specialization: "Neurologist",
    experience: 15,
    qualification: "MBBS, DM",
    consultation_fee: 1000,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
];

// Generate clinics for each city
const generateClinics = () => {
  const clinics = [];
  
  Object.keys(citySpecializations).forEach(city => {
    // Create 2-3 clinics per city
    for (let i = 1; i <= 3; i++) {
      const clinic = {
        name: `${city} ${getClinicType(i)}`,
        city: city,
        address: `${getRandomAddressNumber()}, ${getAreaName(city, i)}`,
        contact: `+91 ${getRandomPhoneNumber()}`,
        email: `info@${city.toLowerCase().replace(/\s/g, '')}hospital${i}.com`,
        specialization: citySpecializations[city],
        doctors: getRandomDoctors(Math.floor(Math.random() * 2) + 2) // 2-3 doctors per clinic
      };
      clinics.push(clinic);
    }
  });
  
  return clinics;
};

// Helper functions
function getClinicType(index) {
  const types = ["City Hospital", "Medical Center", "Healthcare Clinic"];
  return types[index - 1] || "Medical Center";
}

function getRandomAddressNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function getAreaName(city, index) {
  const cityAreas = {
    "Mathura": ["Krishna Nagar", "Vrindavan Road", "Govardhan"],
    "Lucknow": ["Gomti Nagar", "Hazratganj", "Alambagh"],
    "Delhi": ["Connaught Place", "South Extension", "Karol Bagh", "Dwarka"],
    "Mumbai": ["Bandra West", "Andheri East", "Colaba", "Powai"],
    "Pune": ["Kothrud", "Hinjewadi", "Viman Nagar"],
    "Bangalore": ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"],
    "Jaipur": ["Malviya Nagar", "Vaishali Nagar", "Tonk Road"],
    "Hyderabad": ["Banjara Hills", "Gachibowli", "HITEC City"],
    "Chandigarh": ["Sector 17", "Sector 34", "Mohali"],
    "Nagpur": ["Sitabuldi", "Dharampeth", "Wardha Road"],
    "Gurugram": ["Sector 45", "DLF Phase 1", "Sohna Road"],
    "Varanasi": ["Bhelupur", "Lanka", "Sigra"]
  };
  
  const areas = cityAreas[city] || ["Main Road", "City Center"];
  return areas[index - 1] || areas[0];
}

function getRandomPhoneNumber() {
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const restDigits = Math.floor(Math.random() * 900000000) + 100000000; // 9 digits
  return `${firstDigit}${restDigits}`;
}

function getRandomDoctors(count) {
  const shuffled = [...sampleDoctors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Main function to seed database
async function seedDatabase() {
  try {
    // Connect to MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://your_username:your_password@cluster3.mongodb.net/your_database';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing data
    await Clinic.deleteMany({});
    console.log('Cleared existing clinics');
    
    // Generate new clinics
    const clinics = generateClinics();
    
    // Insert clinics
    await Clinic.insertMany(clinics);
    console.log(`Inserted ${clinics.length} clinics`);
    
    // Verify insertion
    const count = await Clinic.countDocuments();
    console.log(`Total clinics in database: ${count}`);
    
    // Show sample data
    const sampleClinic = await Clinic.findOne({ city: "Gurugram" });
    console.log('\nSample Gurugram Clinic:');
    console.log(JSON.stringify(sampleClinic, null, 2));
    
    mongoose.disconnect();
    console.log('\nSeeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();