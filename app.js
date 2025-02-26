const express = require('express');
const app = express();
const dbConnection = require('./config/mongo');
const { graphqlHTTP } = require('express-graphql');
const importData = require('./config/importData');
const schema = require('./modules/mainSchema');
const resolver = require('./modules/mainResolvers');

const startServer = async () => {
    try {
      await dbConnection();
      await importData();
  
      app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: resolver,
        graphiql: true,
        formatError: (err) => {
          // Return just the error message
          return { message: err.message };
        }
      }));
  
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();