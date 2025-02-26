const Order = require('../../models/Order');
const User = require('../../models/User');  // Import User model

const customerSpendingResolver = {
  getCustomerSpending: async ({ customerId }) => {
    // First check if customer exists
    const customerExists = await User.findOne({ customerId: customerId });
    if (!customerExists) {
      throw new Error('No such customer');  // Simplified error message
    }

    try {
      const pipeline = [
        {
          $match: {
            customerId: customerId
          }
        },
        {
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$totalAmount" },
            averageOrderValue: { $avg: "$totalAmount" },
            lastOrderDate: { $max: "$orderDate" }
          }
        },
        {
          $project: {
            customerId: "$_id",
            totalSpent: { $round: [{ $ifNull: ["$totalSpent", 0] }, 2] },
            averageOrderValue: { $round: [{ $ifNull: ["$averageOrderValue", 0] }, 2] },
            lastOrderDate: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%SZ",
                date: { $ifNull: ["$lastOrderDate", new Date()] }
              }
            },
            _id: 0
          }
        }
      ];

      const result = await Order.aggregate(pipeline);
      
      // If customer exists but has no orders
      if (!result.length) {
        return {
          customerId: customerId,
          totalSpent: 0,
          averageOrderValue: 0,
          lastOrderDate: new Date().toISOString()  // Current date for new customers
        };
      }

      return result[0];
    } catch (error) {
      throw new Error('Error processing request');  // Simplified error message
    }
  }
};

module.exports = customerSpendingResolver;
