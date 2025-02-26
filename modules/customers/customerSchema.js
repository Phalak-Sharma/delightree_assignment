const customerSpendingSchema = `
  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
  }
`;

module.exports = customerSpendingSchema;