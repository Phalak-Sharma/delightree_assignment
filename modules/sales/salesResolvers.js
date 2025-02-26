const Order = require('../../models/Order');

const salesAnalyticsResolver = {
  getSalesAnalytics: async ({ startDate, endDate }) => {
    try {
        const pipeline = [{
          $match: {
            orderDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            status: "completed"
          }
        },

        { $unwind: "$products" },

        {
          $lookup: {
            from: "products",
            let: { productId: "$products.productId" },
            pipeline: [
              {
                $match: {
                  $expr: { 
                    $eq: ["$productId", "$$productId"]
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
          $group: {
            _id: {
              category: { $ifNull: ["$productDetails.category", "Uncategorized"] }
            },
            categoryRevenue: { 
              $sum: { 
                $multiply: ["$products.quantity", "$products.price"] 
              }
            }
          }
        },

        {
          $group: {
            _id: null,
            totalRevenue: { 
              $sum: "$categoryRevenue" 
            },
            categoryBreakdown: {
              $push: {
                category: "$_id.category",
                revenue: "$categoryRevenue"
              }
            }
          }
        },

        {
          $project: {
            _id: 0,
            totalRevenue: { $round: ["$totalRevenue", 2] },
            completedOrders: { $size: "$categoryBreakdown" },
            categoryBreakdown: {
              $map: {
                input: "$categoryBreakdown",
                as: "category",
                in: {
                  category: "$$category.category",
                  revenue: { $round: ["$$category.revenue", 2] }
                }
              }
            }
          }
        }];

        const results = await Order.aggregate(pipeline);
        
        // Return default values if no results
        if (!results || results.length === 0) {
          return {
            totalRevenue: 0,
            completedOrders: 0,
            categoryBreakdown: []
          };
        }

        return results[0];
    } catch (error) {
      throw new Error(`Failed to fetch sales analytics: ${error.message}`);
    }
  }
};

module.exports = salesAnalyticsResolver;
