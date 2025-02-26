const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    location: String,
    gender: String,
    customerId: String
});

user.index({ customerId: 1 });         

module.exports = mongoose.model('User', user);