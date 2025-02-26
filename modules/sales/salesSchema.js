const { buildSchema } = require('graphql');

const salesAnalyticsSchema = `
  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue!]!
  }
`;

module.exports = salesAnalyticsSchema;