const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://abhinavaddress:abhinavaddress@cluster0.hr0ug6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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