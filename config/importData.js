const fs = require('fs');
const csvParser = require('csv-parser');
const dbConnection = require('./mongo');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const path = require('path');

const importData = async () => {
    try {
        await dbConnection();
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Order.deleteMany({})
        ]);

        //customers import
        const users = await new Promise((resolve, reject) => {
            const userData = [];
            fs.createReadStream(path.join(__dirname, '../data/customers.csv'))
                .pipe(csvParser({
                    mapValues: ({ header, value }) => value.trim() // Trim whitespace
                }))
                .on('data', (row) => {
                    
                    if (row.name && row.email && row.age) {
                        userData.push({
                            name: row.name,
                            email: row.email,
                            age: Number(row.age),
                            location: row.location || '',
                            gender: row.gender || '',
                            customerId: row._id,
                        });
                    } else {
                    }
                })
                .on('end', () => {
                    resolve(userData);
                })
                .on('error', (error) => {
                    console.error('Error reading users.csv:', error);
                    reject(error);
                });
        });

        if (users.length > 0) {
            console.log("users ",users);
            await User.insertMany(users);
        }

        //products import
        const products = await new Promise((resolve, reject) => {
            const productData = [];
            fs.createReadStream(path.join(__dirname, '../data/products.csv'))
                .pipe(csvParser({
                    mapValues: ({ header, value }) => value.trim()
                }))
                .on('data', (row) => {
                    if (row.name && row.price) {
                        productData.push({
                            productId: row._id,
                            name: row.name,
                            category: row.category || 'Uncategorized',
                            stock: parseInt(row.stock) || 0,
                            price: parseFloat(row.price) || 0
                        });
                    }
                })
                .on('end', () => resolve(productData))
                .on('error', reject);
        });
        if (products.length > 0) {
            console.log("products ",products);
            await Product.insertMany(products);
        }

        //orders import
        const orders = await new Promise((resolve, reject) => {
            const orderData = [];
            fs.createReadStream(path.join(__dirname, '../data/orders.csv'))
                .pipe(csvParser({
                    mapValues: ({ header, value }) => value.trim()
                }))
                .on('data', (row) => {
                    try {
                        let products = [];
                        if (row.products) {
                            const productsString = row.products.replace(/'/g, '"');
                            products = JSON.parse(productsString).map(product => ({
                                productId: product.productId,
                                quantity: parseInt(product.quantity),
                                price: parseFloat(product.priceAtPurchase)
                            }));
                        }

                        orderData.push({
                            customerId: row.customerId,
                            products: products,
                            totalAmount: parseFloat(row.totalAmount),
                            orderDate: new Date(row.orderDate),
                            status: row.status,
                            orderId: row._id,
                        });

                    } catch (error) {
                        console.log('Error processing row:', row);
                        console.log('Error details:', error.message);
                    }
                })
                .on('end', () => {
                    resolve(orderData);
                })
                .on('error', reject);
        });

        if (orders.length > 0) {
            await Order.insertMany(orders);
        }

        console.log('Data import completed successfully');

    } catch (error) {
        console.error('Error in importing data:', error);
        throw error;
    }
};

module.exports = importData;