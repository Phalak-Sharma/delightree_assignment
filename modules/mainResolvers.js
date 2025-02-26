const customerSpendingResolver = require('./customers/customerResolvers');
const topProductsResolver = require('./products/productResolvers');
const salesAnalyticsResolver = require('./sales/salesResolvers');
const newOrderMutation = require('./newOrders/newOrderMutation');

const rootResolver = {
  ...customerSpendingResolver,
  ...topProductsResolver,
  ...salesAnalyticsResolver,
  ...newOrderMutation
};

module.exports = rootResolver;