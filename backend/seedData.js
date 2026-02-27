/**
 * Seed Script — populates MongoDB with doctors, services, and an admin user.
 * Run with: node seedData.js
 * Make sure MONGO_URI is set in your .env before running.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Service = require('./models/Service');

const doctors = [
  { name: 'Dr. P. Srinivas Rao', specialty: 'Cardiology', experience: '18 years', rating: 4.9, patients: '3,200+', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Dr. K. Lakshmi Devi', specialty: 'Cardiology', experience: '15 years', rating: 4.8, patients: '2,800+', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Dr. M. Venkateswara Reddy', specialty: 'Cardiology', experience: '22 years', rating: 5, patients: '4,500+', image: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { name: 'Dr. G. Sunitha', specialty: 'Cardiology', experience: '12 years', rating: 4.7, patients: '1,900+', image: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { name: 'Dr. V. Ramesh Babu', specialty: 'Neurology', experience: '16 years', rating: 4.8, patients: '2,400+', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { name: 'Dr. S. Vijaya Lakshmi', specialty: 'Neurology', experience: '14 years', rating: 4.9, patients: '2,100+', image: 'https://randomuser.me/api/portraits/women/63.jpg' },
  { name: 'Dr. N. Srinath', specialty: 'Neurology', experience: '11 years', rating: 4.7, patients: '1,700+', image: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { name: 'Dr. T. Mohan Krishna', specialty: 'Orthopedics', experience: '19 years', rating: 4.9, patients: '3,500+', image: 'https://randomuser.me/api/portraits/men/62.jpg' },
  { name: 'Dr. A. Padmavathi', specialty: 'Orthopedics', experience: '13 years', rating: 4.7, patients: '2,000+', image: 'https://randomuser.me/api/portraits/women/53.jpg' },
  { name: 'Dr. K. Siva Kumar', specialty: 'Orthopedics', experience: '16 years', rating: 4.8, patients: '2,600+', image: 'https://randomuser.me/api/portraits/men/72.jpg' },
  { name: 'Dr. P. Rajeshwari', specialty: 'Ophthalmology', experience: '14 years', rating: 4.8, patients: '2,200+', image: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { name: 'Dr. D. Narayana Rao', specialty: 'Ophthalmology', experience: '21 years', rating: 5, patients: '4,100+', image: 'https://randomuser.me/api/portraits/men/37.jpg' },
  { name: 'Dr. B. Uma Devi', specialty: 'Ophthalmology', experience: '11 years', rating: 4.7, patients: '1,800+', image: 'https://randomuser.me/api/portraits/women/27.jpg' },
  { name: 'Dr. C. Sridhar', specialty: 'Dentistry', experience: '15 years', rating: 4.8, patients: '2,500+', image: 'https://randomuser.me/api/portraits/men/83.jpg' },
  { name: 'Dr. M. Aruna', specialty: 'Dentistry', experience: '12 years', rating: 4.7, patients: '1,900+', image: 'https://randomuser.me/api/portraits/women/73.jpg' },
  { name: 'Dr. V. Prasad', specialty: 'Dentistry', experience: '9 years', rating: 4.6, patients: '1,400+', image: 'https://randomuser.me/api/portraits/men/93.jpg' },
  { name: 'Dr. G. Lalitha', specialty: 'Pediatrics', experience: '17 years', rating: 4.9, patients: '3,300+', image: 'https://randomuser.me/api/portraits/women/13.jpg' },
  { name: 'Dr. S. Krishna Murthy', specialty: 'Pediatrics', experience: '14 years', rating: 4.8, patients: '2,400+', image: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { name: 'Dr. P. Anitha', specialty: 'Pediatrics', experience: '11 years', rating: 4.7, patients: '1,800+', image: 'https://randomuser.me/api/portraits/women/43.jpg' },
  { name: 'Dr. R. Venkata Ramana', specialty: 'General Medicine', experience: '20 years', rating: 4.9, patients: '5,000+', image: 'https://randomuser.me/api/portraits/men/73.jpg' },
  { name: 'Dr. T. Saroja', specialty: 'General Medicine', experience: '16 years', rating: 4.8, patients: '3,100+', image: 'https://randomuser.me/api/portraits/women/83.jpg' },
  { name: 'Dr. K. Ravi Shankar', specialty: 'General Medicine', experience: '13 years', rating: 4.7, patients: '2,200+', image: 'https://randomuser.me/api/portraits/men/53.jpg' },
  { name: 'Dr. N. Jayasree', specialty: 'Pulmonology', experience: '14 years', rating: 4.8, patients: '1,900+', image: 'https://randomuser.me/api/portraits/women/93.jpg' },
  { name: 'Dr. M. Srinivasa Rao', specialty: 'Pulmonology', experience: '17 years', rating: 4.9, patients: '2,600+', image: 'https://randomuser.me/api/portraits/men/63.jpg' },
  { name: 'Dr. L. Radhika', specialty: 'Dermatology', experience: '12 years', rating: 4.7, patients: '1,800+', image: 'https://randomuser.me/api/portraits/women/67.jpg' },
  { name: 'Dr. B. Nageswara Rao', specialty: 'Dermatology', experience: '15 years', rating: 4.8, patients: '2,300+', image: 'https://randomuser.me/api/portraits/men/47.jpg' },
  { name: 'Dr. S. Shobha Rani', specialty: 'Gynecology', experience: '18 years', rating: 4.9, patients: '3,400+', image: 'https://randomuser.me/api/portraits/women/57.jpg' },
  { name: 'Dr. P. Sridevi', specialty: 'Gynecology', experience: '14 years', rating: 4.8, patients: '2,500+', image: 'https://randomuser.me/api/portraits/women/77.jpg' },
  { name: 'Dr. K. Sudhakar', specialty: 'ENT', experience: '16 years', rating: 4.8, patients: '2,400+', image: 'https://randomuser.me/api/portraits/men/87.jpg' },
  { name: 'Dr. M. Jyothi', specialty: 'ENT', experience: '12 years', rating: 4.7, patients: '1,800+', image: 'https://randomuser.me/api/portraits/women/97.jpg' },
  { name: 'Dr. A. Chandra Sekhar', specialty: 'Psychiatry', experience: '15 years', rating: 4.8, patients: '2,100+', image: 'https://randomuser.me/api/portraits/men/77.jpg' },
  { name: 'Dr. V. Uma Maheswari', specialty: 'Psychiatry', experience: '13 years', rating: 4.7, patients: '1,700+', image: 'https://randomuser.me/api/portraits/women/47.jpg' },
];

const services = [
  { icon: 'heartbeat', title: 'Cardiology', description: 'Expert heart care...', doctors: '15+ specialists', bgColor: 'bg-red-50' },
  { icon: 'brain', title: 'Neurology', description: 'Comprehensive care for brain...', doctors: '12+ specialists', bgColor: 'bg-purple-50' },
  { icon: 'baby', title: 'Pediatrics', description: 'Child-friendly medical care...', doctors: '20+ specialists', bgColor: 'bg-pink-50' },
  { icon: 'bone', title: 'Orthopedics', description: 'Treatment for bone, joint...', doctors: '18+ specialists', bgColor: 'bg-orange-50' },
  { icon: 'eye', title: 'Ophthalmology', description: 'Complete eye care...', doctors: '10+ specialists', bgColor: 'bg-blue-50' },
  { icon: 'tooth', title: 'Dentistry', description: 'General and cosmetic dentistry...', doctors: '14+ specialists', bgColor: 'bg-teal-50' },
  { icon: 'stethoscope', title: 'General Medicine', description: 'Primary care...', doctors: '25+ specialists', bgColor: 'bg-green-50' },
  { icon: 'lungs', title: 'Pulmonology', description: 'Diagnosis and treatment of respiratory diseases...', doctors: '8+ specialists', bgColor: 'bg-indigo-50' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({ email: 'admin@hospital.com' });

    // Insert doctors and services
    await Doctor.insertMany(doctors);
    await Service.insertMany(services);

    // Create admin user (password will be hashed via pre-save hook)
    await User.create({
      name: 'Admin',
      email: 'admin@hospital.com',
      password: 'Admin@123',
      role: 'admin',
    });

    console.log('✅ Seed data inserted successfully!');
    console.log('📧 Admin login: admin@hospital.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();