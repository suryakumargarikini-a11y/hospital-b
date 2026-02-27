const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data/db.json');

const seedData = {
  users: [{ id: 1, name: 'Admin', email: 'admin@hospital.com', password: '123456', role: 'admin' }],
  appointments: [],
  
  // 👨‍⚕️ DOCTORS WITH DIFFERENT AVAILABILITY DAYS
  doctors: [
    // ========== CARDIOLOGY ==========
    // 2 doctors available Mon, Wed, Fri
    { 
      id: 1, 
      name: 'Dr. P. Srinivas Rao', 
      specialty: 'Cardiology', 
      experience: '18 years', 
      rating: 4.9, 
      patients: '3,200+', 
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    { 
      id: 2, 
      name: 'Dr. M. Venkateswara Reddy', 
      specialty: 'Cardiology', 
      experience: '22 years', 
      rating: 5.0, 
      patients: '4,500+', 
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    
    // 2 doctors available Tue, Thu, Sat
    { 
      id: 3, 
      name: 'Dr. K. Lakshmi Devi', 
      specialty: 'Cardiology', 
      experience: '15 years', 
      rating: 4.8, 
      patients: '2,800+', 
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    { 
      id: 4, 
      name: 'Dr. G. Sunitha', 
      specialty: 'Cardiology', 
      experience: '12 years', 
      rating: 4.7, 
      patients: '1,900+', 
      image: 'https://randomuser.me/api/portraits/women/24.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== NEUROLOGY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 5, 
      name: 'Dr. V. Ramesh Babu', 
      specialty: 'Neurology', 
      experience: '16 years', 
      rating: 4.8, 
      patients: '2,400+', 
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 6, 
      name: 'Dr. S. Vijaya Lakshmi', 
      specialty: 'Neurology', 
      experience: '14 years', 
      rating: 4.9, 
      patients: '2,100+', 
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Wed, Thu, Fri
    {
      id: 7,
      name: 'Dr. N. Srinath',
      specialty: 'Neurology',
      experience: '11 years',
      rating: 4.7,
      patients: '1,700+',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      availableDays: ['Wednesday', 'Thursday', 'Friday'],
      maxPerSlot: 4
    },

    // ========== ORTHOPEDICS ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 8, 
      name: 'Dr. T. Mohan Krishna', 
      specialty: 'Orthopedics', 
      experience: '19 years', 
      rating: 4.9, 
      patients: '3,500+', 
      image: 'https://randomuser.me/api/portraits/men/62.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    {
      id: 9,
      name: 'Dr. A. Padmavathi',
      specialty: 'Orthopedics',
      experience: '13 years',
      rating: 4.7,
      patients: '2,000+',
      image: 'https://randomuser.me/api/portraits/women/53.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Mon, Tue, Wed
    {
      id: 10,
      name: 'Dr. K. Siva Kumar',
      specialty: 'Orthopedics',
      experience: '16 years',
      rating: 4.8,
      patients: '2,600+',
      image: 'https://randomuser.me/api/portraits/men/72.jpg',
      availableDays: ['Monday', 'Tuesday', 'Wednesday'],
      maxPerSlot: 4
    },

    // ========== OPHTHALMOLOGY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 11, 
      name: 'Dr. P. Rajeshwari', 
      specialty: 'Ophthalmology', 
      experience: '14 years', 
      rating: 4.8, 
      patients: '2,200+', 
      image: 'https://randomuser.me/api/portraits/women/17.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 12, 
      name: 'Dr. D. Narayana Rao', 
      specialty: 'Ophthalmology', 
      experience: '21 years', 
      rating: 5.0, 
      patients: '4,100+', 
      image: 'https://randomuser.me/api/portraits/men/37.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Wed, Thu, Fri
    {
      id: 13,
      name: 'Dr. B. Uma Devi',
      specialty: 'Ophthalmology',
      experience: '11 years',
      rating: 4.7,
      patients: '1,800+',
      image: 'https://randomuser.me/api/portraits/women/27.jpg',
      availableDays: ['Wednesday', 'Thursday', 'Friday'],
      maxPerSlot: 4
    },

    // ========== DENTISTRY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 14, 
      name: 'Dr. C. Sridhar', 
      specialty: 'Dentistry', 
      experience: '15 years', 
      rating: 4.8, 
      patients: '2,500+', 
      image: 'https://randomuser.me/api/portraits/men/83.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 15, 
      name: 'Dr. M. Aruna', 
      specialty: 'Dentistry', 
      experience: '12 years', 
      rating: 4.7, 
      patients: '1,900+', 
      image: 'https://randomuser.me/api/portraits/women/73.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Mon, Tue, Thu
    {
      id: 16,
      name: 'Dr. V. Prasad',
      specialty: 'Dentistry',
      experience: '9 years',
      rating: 4.6,
      patients: '1,400+',
      image: 'https://randomuser.me/api/portraits/men/93.jpg',
      availableDays: ['Monday', 'Tuesday', 'Thursday'],
      maxPerSlot: 4
    },

    // ========== PEDIATRICS ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 17, 
      name: 'Dr. G. Lalitha', 
      specialty: 'Pediatrics', 
      experience: '17 years', 
      rating: 4.9, 
      patients: '3,300+', 
      image: 'https://randomuser.me/api/portraits/women/13.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 18, 
      name: 'Dr. S. Krishna Murthy', 
      specialty: 'Pediatrics', 
      experience: '14 years', 
      rating: 4.8, 
      patients: '2,400+', 
      image: 'https://randomuser.me/api/portraits/men/23.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Wed, Fri, Sat
    {
      id: 19,
      name: 'Dr. P. Anitha',
      specialty: 'Pediatrics',
      experience: '11 years',
      rating: 4.7,
      patients: '1,800+',
      image: 'https://randomuser.me/api/portraits/women/43.jpg',
      availableDays: ['Wednesday', 'Friday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== GENERAL MEDICINE ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 20, 
      name: 'Dr. R. Venkata Ramana', 
      specialty: 'General Medicine', 
      experience: '20 years', 
      rating: 4.9, 
      patients: '5,000+', 
      image: 'https://randomuser.me/api/portraits/men/73.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 21, 
      name: 'Dr. T. Saroja', 
      specialty: 'General Medicine', 
      experience: '16 years', 
      rating: 4.8, 
      patients: '3,100+', 
      image: 'https://randomuser.me/api/portraits/women/83.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
    // 1 doctor available Mon, Tue, Thu
    {
      id: 22,
      name: 'Dr. K. Ravi Shankar',
      specialty: 'General Medicine',
      experience: '13 years',
      rating: 4.7,
      patients: '2,200+',
      image: 'https://randomuser.me/api/portraits/men/53.jpg',
      availableDays: ['Monday', 'Tuesday', 'Thursday'],
      maxPerSlot: 4
    },

    // ========== PULMONOLOGY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 23, 
      name: 'Dr. N. Jayasree', 
      specialty: 'Pulmonology', 
      experience: '14 years', 
      rating: 4.8, 
      patients: '1,900+', 
      image: 'https://randomuser.me/api/portraits/women/93.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 24, 
      name: 'Dr. M. Srinivasa Rao', 
      specialty: 'Pulmonology', 
      experience: '17 years', 
      rating: 4.9, 
      patients: '2,600+', 
      image: 'https://randomuser.me/api/portraits/men/63.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== DERMATOLOGY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 25, 
      name: 'Dr. L. Radhika', 
      specialty: 'Dermatology', 
      experience: '12 years', 
      rating: 4.7, 
      patients: '1,800+', 
      image: 'https://randomuser.me/api/portraits/women/67.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 26, 
      name: 'Dr. B. Nageswara Rao', 
      specialty: 'Dermatology', 
      experience: '15 years', 
      rating: 4.8, 
      patients: '2,300+', 
      image: 'https://randomuser.me/api/portraits/men/47.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== GYNECOLOGY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 27, 
      name: 'Dr. S. Shobha Rani', 
      specialty: 'Gynecology', 
      experience: '18 years', 
      rating: 4.9, 
      patients: '3,400+', 
      image: 'https://randomuser.me/api/portraits/women/57.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 28, 
      name: 'Dr. P. Sridevi', 
      specialty: 'Gynecology', 
      experience: '14 years', 
      rating: 4.8, 
      patients: '2,500+', 
      image: 'https://randomuser.me/api/portraits/women/77.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== ENT ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 29, 
      name: 'Dr. K. Sudhakar', 
      specialty: 'ENT', 
      experience: '16 years', 
      rating: 4.8, 
      patients: '2,400+', 
      image: 'https://randomuser.me/api/portraits/men/87.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 30, 
      name: 'Dr. M. Jyothi', 
      specialty: 'ENT', 
      experience: '12 years', 
      rating: 4.7, 
      patients: '1,800+', 
      image: 'https://randomuser.me/api/portraits/women/97.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },

    // ========== PSYCHIATRY ==========
    // 1 doctor available Mon, Wed, Fri
    { 
      id: 31, 
      name: 'Dr. A. Chandra Sekhar', 
      specialty: 'Psychiatry', 
      experience: '15 years', 
      rating: 4.8, 
      patients: '2,100+', 
      image: 'https://randomuser.me/api/portraits/men/77.jpg',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxPerSlot: 4
    },
    // 1 doctor available Tue, Thu, Sat
    { 
      id: 32, 
      name: 'Dr. V. Uma Maheswari', 
      specialty: 'Psychiatry', 
      experience: '13 years', 
      rating: 4.7, 
      patients: '1,700+', 
      image: 'https://randomuser.me/api/portraits/women/47.jpg',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      maxPerSlot: 4
    },
  ],
  
  services: [
    { id: 1, icon: 'heartbeat', title: 'Cardiology', description: 'Expert heart care, from diagnostics to surgery. Top cardiologists available.', doctors: '4+ specialists', bgColor: 'bg-red-50' },
    { id: 2, icon: 'brain', title: 'Neurology', description: 'Comprehensive care for brain, spine, and nervous system disorders.', doctors: '3+ specialists', bgColor: 'bg-purple-50' },
    { id: 3, icon: 'baby', title: 'Pediatrics', description: 'Child‑friendly medical care from infancy through adolescence.', doctors: '3+ specialists', bgColor: 'bg-pink-50' },
    { id: 4, icon: 'bone', title: 'Orthopedics', description: 'Treatment for bone, joint, and muscle conditions – sports injuries to arthritis.', doctors: '3+ specialists', bgColor: 'bg-orange-50' },
    { id: 5, icon: 'eye', title: 'Ophthalmology', description: 'Complete eye care, from routine exams to advanced surgeries.', doctors: '3+ specialists', bgColor: 'bg-blue-50' },
    { id: 6, icon: 'tooth', title: 'Dentistry', description: 'General and cosmetic dentistry, oral surgery, and orthodontics.', doctors: '3+ specialists', bgColor: 'bg-teal-50' },
    { id: 7, icon: 'stethoscope', title: 'General Medicine', description: 'Primary care, preventive health, and chronic disease management.', doctors: '3+ specialists', bgColor: 'bg-green-50' },
    { id: 8, icon: 'lungs', title: 'Pulmonology', description: 'Diagnosis and treatment of respiratory diseases – asthma, COPD, and more.', doctors: '2+ specialists', bgColor: 'bg-indigo-50' },
    { id: 9, icon: 'skin', title: 'Dermatology', description: 'Treatment for skin, hair, and nail conditions – acne to skin cancer.', doctors: '2+ specialists', bgColor: 'bg-yellow-50' },
    { id: 10, icon: 'woman', title: 'Gynecology', description: 'Comprehensive women health services, pregnancy care, and reproductive health.', doctors: '2+ specialists', bgColor: 'bg-rose-50' },
    { id: 11, icon: 'ear', title: 'ENT', description: 'Specialized care for ear, nose, and throat disorders.', doctors: '2+ specialists', bgColor: 'bg-amber-50' },
    { id: 12, icon: 'brain', title: 'Psychiatry', description: 'Mental health services, counseling, and psychiatric care.', doctors: '2+ specialists', bgColor: 'bg-slate-50' },
  ],
};

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
console.log('✅ Database seeded successfully!');
console.log('📅 Doctors have different availability days within same departments!');