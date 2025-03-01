# delightree_assignment
A GraphQL API for e-commerce analytics that provides insights into customer spending, top-selling products, and sales analytics.

## Features

- Customer spending analysis
- Top selling products analytics
- Sales analytics with category breakdown


## Tech Stack

- Node.js
- Express
- GraphQL
- MongoDB


## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm


## Installation

1. Clone the repository
git clone https://github.com/Phalak-Sharma/delightree_assignment
cd delightree_assignment

2. Install dependencies
npm install

3. Environment Setup
Create a `.env` file in the root directory 
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.m8oudjr.mongodb.net/<dbName>

4. Data Import
The system automatically imports sample data from CSV files located in the data directory. Ensure you have these files:
customers.csv
products.csv
orders.csv

5. Start the Server
The server will start on port 3000, and GraphiQL interface will be available at `http://localhost:3000/graphql`


### Queries & Mutations
Check file queries.graphql 
