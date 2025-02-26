const orderManagementSchema = `
  input OrderProductInput {
    productName: String!
    quantity: Int!
  }

  type OrderResponse {
    orderId: ID!
    customerId: ID!
    products: [OrderedProduct!]!
    totalAmount: Float!
    orderDate: String!
    status: String!
  }

  type OrderedProduct {
    productId: ID!
    productName: String!
    quantity: Int!
    price: Float!
  }

  type Mutation {
    placeOrder(customerId: ID!, products: [OrderProductInput!]!): OrderResponse
  }
`;

module.exports = orderManagementSchema;
