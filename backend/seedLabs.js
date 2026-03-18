const mongoose = require('mongoose');
const dotenv = require('dotenv');

// We have to specify path to .env since this runs outside index
dotenv.config({ path: 'd:/web/backend/.env' });

const { LabTest } = require('d:/web/backend/models/LabTest.js');

const seedLabs = async () => {
  try {
    await LabTest.deleteMany();
    
    const labs = [
      { name: "Complete Blood Count (CBC)", description: "Measures different features of your blood, including red blood cells, white blood cells, and platelets.", price: 499, preparation: "None" },
      { name: "Lipid Profile", description: "A blood test that can measure the amount of cholesterol and triglycerides in your blood.", price: 799, preparation: "Fasting for 10-12 hours" },
      { name: "Thyroid Profile (T3, T4, TSH)", description: "Checks how well the thyroid gland is working.", price: 599, preparation: "None" },
      { name: "Fasting Blood Sugar (FBS)", description: "Measures blood glucose after an overnight fast to screen for diabetes.", price: 199, preparation: "Fasting for 8-10 hours" },
      { name: "Vitamin D (25-OH)", description: "Measures the level of vitamin D in your blood.", price: 1299, preparation: "None" },
      { name: "Liver Function Test (LFT)", description: "Evaluates how well your liver is working.", price: 899, preparation: "None" },
    ];

    await LabTest.insertMany(labs);
    console.log("Lab Tests Seeding SUCCESS");
    process.exit();
  } catch (error) {
    console.error("Lab Tests Seeding FAILED", error);
    process.exit(1);
  }
};

seedLabs();
