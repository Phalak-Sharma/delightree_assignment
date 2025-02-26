const { buildSchema } = require('graphql');
const customerSpendingSchema = require('./customers/customerSchema');
const topProductsSchema = require('./products/productSchema');
const salesAnalyticsSchema = require('./sales/salesSchema');
const newOrderSchema = require('./newOrders/newOrdersSchema');

const schema = buildSchema(`
  ${customerSpendingSchema}
  ${topProductsSchema}
  ${salesAnalyticsSchema}
  ${newOrderSchema}

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
  }
`);

module.exports = schema;