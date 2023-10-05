const express = require('express');
const router = express.Router();
const { client } = require('../dbConnection/db');
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
})

async function run() {
  await redisClient.connect();
  console.log("Check", client.isOpen); // this is true
}

run();

// console.log("Connecting to the Redis");

function validateCheck(req, res, next) {
  const { product_name, description, price, stock_quantity } = req.body;
  if (product_name && description && price && stock_quantity) {
    next();
  } else {
    res.status(400).send('Check products');
  }
}

router.get('/getProduct', async function (req, res, next) {
  console.log("clickeddd");
  let productData = await redisClient.get('product')
  if (productData) {
    console.log("Redis data found: ", productData);
    res.status(200).send(JSON.parse(productData)); // Assuming productData is stored as a JSON string
  } else {
    let getData = (await client.query("select * from products")).rows
    console.log("No Redis data found",getData);
    res.status(200).send(getData);
  }
  console.log("productData ***", productData);
});

router.post('/setAllProduct', validateCheck, async function (req, res, next) {
  const getData = req.body;
  client.query(`insert into products (product_name,description,price,stock_quantity) values($1,$2,$3,$4) returning *`, [getData.product_name, getData.description, getData.price, getData.stock_quantity], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Store the product data in Redis
      redisClient.set('product', JSON.stringify(result.rows[0]), (err) => {
        if (err) {
          console.error('Redis SET error:', err);
        } else {
          console.log('Product data stored in Redis');
        }
      });

      res.status(200).send('Product data stored successfully');
    }
  });

});


module.exports = router;
