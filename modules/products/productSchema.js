const { buildSchema } = require('graphql');

const topProductsSchema = `
  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }
`;

module.exports = topProductsSchema;