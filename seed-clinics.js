const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://haldharsinghepic_db_user:123456789101112@cluster0.tektwpr.mongodb.net/rupaya";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

// Define Clinic Schema
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

// Fixed data for all cities
const citiesData = {
  "Mathura": [
    {
      name: "Mathura City Hospital",
      address: "15 Krishna Nagar, Mathura",
      contact: "+91 9876543210",
      email: "info@mathurahospital.com"
    },
    {
      name: "Mathura General Clinic",
      address: "25 Radha Road, Mathura",
      contact: "+91 9876543211",
      email: "contact@mathuraclinic.com"
    }
  ],
  "Lucknow": [
    {
      name: "Lucknow Medicare Center",
      address: "10 Hazratganj, Lucknow",
      contact: "+91 9876543212",
      email: "info@lucknowmedicare.com"
    },
    {
      name: "Lucknow Health Center",
      address: "5 Gomti Nagar, Lucknow",
      contact: "+91 9876543213",
      email: "contact@lucknowhealth.com"
    }
  ],
  "Delhi": [
    {
      name: "Delhi HealthFirst",
      address: "50 Connaught Place, Delhi",
      contact: "+91 9876543214",
      email: "info@delhihealthfirst.com"
    },
    {
      name: "Delhi General Hospital",
      address: "25 CP, Delhi",
      contact: "+91 9876543215",
      email: "contact@delhihospital.com"
    }
  ],
  "Mumbai": [
    {
      name: "Mumbai Wellness Center",
      address: "30 Marine Drive, Mumbai",
      contact: "+91 9876543216",
      email: "info@mumbaiwellness.com"
    },
    {
      name: "Mumbai City Hospital",
      address: "15 Bandra West, Mumbai",
      contact: "+91 9876543217",
      email: "contact@mumbaicityhospital.com"
    }
  ],
  "Pune": [
    {
      name: "Pune Family Clinic",
      address: "8 FC Road, Pune",
      contact: "+91 9876543218",
      email: "info@punefamilyclinic.com"
    },
    {
      name: "Pune Health Care",
      address: "12 Kothrud, Pune",
      contact: "+91 9876543219",
      email: "contact@punehealthcare.com"
    }
  ],
  "Bangalore": [
    {
      name: "Bangalore CarePlus Clinic",
      address: "22 MG Road, Bangalore",
      contact: "+91 9876543220",
      email: "info@bangalorecareplus.com"
    },
    {
      name: "Bangalore General Hospital",
      address: "18 Koramangala, Bangalore",
      contact: "+91 9876543221",
      email: "contact@bangalorehospital.com"
    }
  ],
  "Jaipur": [
    {
      name: "Jaipur Healing Touch",
      address: "14 MI Road, Jaipur",
      contact: "+91 9876543222",
      email: "info@jaipurhealing.com"
    },
    {
      name: "Jaipur Medical Center",
      address: "7 Malviya Nagar, Jaipur",
      contact: "+91 9876543223",
      email: "contact@jaipurmedical.com"
    }
  ],
  "Hyderabad": [
    {
      name: "Hyderabad Prime Medical",
      address: "18 Banjara Hills, Hyderabad",
      contact: "+91 9876543224",
      email: "info@hyderabadprime.com"
    },
    {
      name: "Hyderabad Health Clinic",
      address: "9 Secunderabad, Hyderabad",
      contact: "+91 9876543225",
      email: "contact@hyderabadclinic.com"
    }
  ],
  "Chandigarh": [
    {
      name: "Chandigarh City Hospital",
      address: "5 Sector 17, Chandigarh",
      contact: "+91 9876543226",
      email: "info@chandigarhhospital.com"
    },
    {
      name: "Chandigarh General Clinic",
      address: "12 Sector 35, Chandigarh",
      contact: "+91 9876543227",
      email: "contact@chandigarhclinic.com"
    }
  ],
  "Nagpur": [
    {
      name: "Nagpur General Hospital",
      address: "12 Sitabuldi, Nagpur",
      contact: "+91 9876543228",
      email: "info@nagpurhospital.com"
    },
    {
      name: "Nagpur Medical Center",
      address: "8 Dharampeth, Nagpur",
      contact: "+91 9876543229",
      email: "contact@nagpurmedical.com"
    }
  ],
  "Gurugram": [
    {
      name: "Gurugram LifeLine Clinic",
      address: "7 MG Road, Gurugram",
      contact: "+91 9876543230",
      email: "info@gurugramlifeline.com"
    },
    {
      name: "Gurugram City Hospital",
      address: "15 Sector 14, Gurugram",
      contact: "+91 9876543231",
      email: "contact@gurugramhospital.com"
    }
  ],
  "Varanasi": [
    {
      name: "Varanasi Medicare Center",
      address: "3 Godowlia, Varanasi",
      contact: "+91 9876543232",
      email: "info@varanasimedicare.com"
    },
    {
      name: "Varanasi Health Clinic",
      address: "8 Lanka, Varanasi",
      contact: "+91 9876543233",
      email: "contact@varanasiclinic.com"
    }
  ]
};

// Doctor data
const doctorsData = [
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
    specialization: "Dermatologist",
    experience: 8,
    qualification: "MBBS, MD",
    consultation_fee: 600,
    availability: ["Tuesday", "Thursday"]
  },
  {
    name: "Dr. Amit Patel",
    specialization: "Orthopedic",
    experience: 15,
    qualification: "MBBS, MS",
    consultation_fee: 1000,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    name: "Dr. Anjali Singh",
    specialization: "Pediatrician",
    experience: 10,
    qualification: "MBBS, DCH",
    consultation_fee: 700,
    availability: ["Monday", "Wednesday", "Friday", "Saturday"]
  },
  {
    name: "Dr. Rohan Verma",
    specialization: "Neurologist",
    experience: 18,
    qualification: "MBBS, DM",
    consultation_fee: 1200,
    availability: ["Monday", "Thursday"]
  }
];

async function seedDatabase() {
  const isConnected = await connectDB();
  if (!isConnected) {
    return;
  }

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing clinics...');
    await Clinic.deleteMany({});
    console.log('✅ Existing clinics cleared');

    // Prepare clinics array
    const allClinics = [];
    
    console.log('🏥 Creating clinics for each city...');
    
    // Create clinics for each city
    for (const [city, cityClinics] of Object.entries(citiesData)) {
      console.log(`  Creating clinics for ${city}...`);
      
      for (const clinicInfo of cityClinics) {
        // Assign 1-2 random doctors to each clinic
        const numDoctors = Math.floor(Math.random() * 2) + 1;
        const clinicDoctors = [];
        
        for (let i = 0; i < numDoctors; i++) {
          const randomDoctor = doctorsData[Math.floor(Math.random() * doctorsData.length)];
          clinicDoctors.push({ ...randomDoctor });
        }
        
        const clinic = new Clinic({
          name: clinicInfo.name,
          city: city,
          address: clinicInfo.address,
          contact: clinicInfo.contact,
          email: clinicInfo.email,
          doctors: clinicDoctors
        });
        
        allClinics.push(clinic);
      }
    }
    
    console.log(`📦 Total clinics prepared: ${allClinics.length}`);
    
    if (allClinics.length === 0) {
      throw new Error('No clinics were created! Check citiesData.');
    }
    
    // Insert clinics one by one to avoid bulk operation issues
    console.log('⬆️  Inserting clinics into database...');
    let insertedCount = 0;
    
    for (const clinic of allClinics) {
      try {
        await clinic.save();
        insertedCount++;
        console.log(`  ✅ Inserted: ${clinic.name} (${clinic.city})`);
      } catch (err) {
        console.log(`  ❌ Failed to insert ${clinic.name}: ${err.message}`);
      }
    }
    
    console.log(`\n🎉 Successfully inserted ${insertedCount} out of ${allClinics.length} clinics`);
    
    // Verify data
    console.log('\n📊 Verification:');
    const totalInDB = await Clinic.countDocuments();
    console.log(`Total clinics in database: ${totalInDB}`);
    
    // Show cities with counts
    const cities = await Clinic.distinct('city');
    console.log('\n🏙️  Cities with clinics:');
    for (const city of cities) {
      const count = await Clinic.countDocuments({ city: city });
      console.log(`  ${city}: ${count} clinics`);
    }
    
    // Show sample clinic
    console.log('\n🔍 Sample Clinic:');
    const sample = await Clinic.findOne();
    if (sample) {
      console.log(`Name: ${sample.name}`);
      console.log(`City: ${sample.city}`);
      console.log(`Doctors: ${sample.doctors.length}`);
      sample.doctors.forEach((doc, idx) => {
        console.log(`  ${idx + 1}. ${doc.name} - ${doc.specialization} (₹${doc.consultation_fee})`);
      });
    }
    
    // Count total doctors
    const allClinicsInDB = await Clinic.find({});
    let totalDoctors = 0;
    allClinicsInDB.forEach(clinic => {
      totalDoctors += clinic.doctors.length;
    });
    console.log(`\n👨‍⚕️ Total Doctors across all clinics: ${totalDoctors}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.error(error);
  } finally {
    // Close connection
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    console.log('\n✨ Seeding process completed!');
  }
}

// Run the seeding
seedDatabase();