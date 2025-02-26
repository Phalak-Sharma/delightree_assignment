require('dotenv').config();

const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        console.log(process.env.MONGO_URI);
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error; 
    }
}

module.exports = dbConnection;