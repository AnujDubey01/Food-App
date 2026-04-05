const mongoose = require('mongoose');
const config = require('./dotenv');

const connectDB = (async () => {
    
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
});

module.exports = connectDB;