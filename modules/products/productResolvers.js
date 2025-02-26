const Order = require('../../models/Order');
const Product = require('../../models/Product');

const topProductsResolver = {
  getTopSellingProducts: async ({ limit }) => {
    try {
      const pipeline = [
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" }
          }
        },
        
        { $sort: { totalSold: -1 } },
        
        { $limit: limit || 5 },
        
        {
          $lookup: {
            from: "products", 
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { 
                    $eq: [
                      "$productId",  // Changed from _id to productId
                      "$$productId"
                    ] 
                  }
                }
              }
            ],
            as: "productDetails"
          }
        },
        
        { $unwind: { 
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }},
        
        {
          $project: {
            productId: "$_id",
            name: { $ifNull: ["$productDetails.name", "Unknown Product"] },
            totalSold: 1,
            _id: 0
          }
        }
      ];

      const results = await Order.aggregate(pipeline);
      console.log('Aggregation results:', results);
      return results;

    } catch (error) {
      console.error('Error in getTopSellingProducts:', error);
      throw new Error(`Failed to fetch top selling products: ${error.message}`);
    }
  }
};

module.exports = topProductsResolver;
