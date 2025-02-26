const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String,
    stock: Number,
    price: Number,
    productId: String
});

productSchema.index({ category: 1 });  
productSchema.index({ name: 1 });  
productSchema.index({ productId: 1 });  

module.exports = mongoose.model('Product', productSchema);