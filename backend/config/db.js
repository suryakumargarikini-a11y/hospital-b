const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Create separate connection strings by appending database names to the base URI
const baseUri = process.env.MONGO_URI;

// We need to properly append the database name. If the URI already has a database name (like /hospital),
// we replace it. If it doesn't, we append it.

const getDbUri = (dbName) => {
    if (!baseUri) {
        console.error('❌ MONGO_URI is not defined in .env');
        process.exit(1);
    }

    // Check if the URI already has a database name before query parameters
    const urlParts = baseUri.split('?');
    const pathParts = urlParts[0].split('/');

    // If the last part has a length > 0 and no '.' (like mongodb.net), it's likely a db name
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart && !lastPart.includes('.')) {
        // Replace existing DB name
        pathParts[pathParts.length - 1] = dbName;
    } else {
        // Append DB name
        pathParts.push(dbName);
    }

    const newBase = pathParts.join('/');
    return urlParts.length > 1 ? `${newBase}?${urlParts[1]}` : newBase;
};

const patientDbUri = getDbUri('patientdb');
const adminDbUri = getDbUri('admindb');

console.log(`🔌 Connecting to Patient DB...`);
const patientDbConnection = mongoose.createConnection(patientDbUri);

patientDbConnection.on('connected', () => {
    console.log('✅ Patient DB Connected');
});

patientDbConnection.on('error', (err) => {
    console.error('❌ Patient DB connection error:', err.message);
});

console.log(`🔌 Connecting to Admin DB...`);
const adminDbConnection = mongoose.createConnection(adminDbUri);

adminDbConnection.on('connected', () => {
    console.log('✅ Admin DB Connected');
});

adminDbConnection.on('error', (err) => {
    console.error('❌ Admin DB connection error:', err.message);
});

const connectDBs = async () => {
    try {
        await Promise.all([
            patientDbConnection.asPromise(),
            adminDbConnection.asPromise()
        ]);
        console.log('✅ All Databases Connected Successfully');
    } catch (error) {
        console.error('❌ Database Connection Error:', error);
        process.exit(1);
    }
};

module.exports = {
    patientDbConnection,
    adminDbConnection,
    connectDBs
};
