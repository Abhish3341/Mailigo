const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Optional: Set strictQuery to false (still okay for Mongoose 7)
        mongoose.set('strictQuery', false);

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4 // Use IPv4, skip trying IPv6
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;