const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    status: { type: String, required: true },
    orderId: String
});

orderSchema.index({ customerId: 1 }); 
orderSchema.index({ orderDate: 1 });  
orderSchema.index({ "products.productId": 1 });
orderSchema.index({ orderId: 1 });  

module.exports = mongoose.model('Order', orderSchema);