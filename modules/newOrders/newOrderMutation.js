const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { v4: uuidv4 } = require('uuid');

const orderManagementMutations = {
  placeOrder: async ({ customerId, products }) => {
    try {

      const productDetails = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findOne({ name: item.productName });
          if (!product) {
            throw new Error(`Product not found: ${item.productName}`);
          }
          

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productName}. Available: ${product.stock}, Requested: ${item.quantity}`);
          }


          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -item.quantity }
          });

          return {
            productId: product._id,
            productName: product.name,
            quantity: item.quantity,
            price: product.price
          };
        })
      );


      const totalAmount = productDetails.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );


      const newOrder = new Order({
        orderId: uuidv4(),
        customerId,
        products: productDetails,
        totalAmount,
        orderDate: new Date(),
        status: 'pending'
      });

      await newOrder.save();

      return {
        orderId: newOrder.orderId,
        customerId,
        products: productDetails,
        totalAmount,
        orderDate: newOrder.orderDate.toISOString(),
        status: newOrder.status
      };

    } catch (error) {
      console.error('Error in placeOrder:', error);
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }
};

module.exports = orderManagementMutations;
