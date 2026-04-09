const mongoose = require('mongoose');
const config = require('./dotenv');

const connectDB = (async () => {
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
});

module.exports = connectDB;