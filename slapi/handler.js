"use-strict";

// Require the framework and instantiate it
const api = require('lambda-api')();

// Local ENV - Comment for AWS
require('dotenv').config();

// Uncomment For AWS 
const DB_URI = process.env.DB_URI;

// DB Setting

const MongoClient = require("mongodb").MongoClient;

let cacheDb = null;

const connectToDatabase = async () => {
  if (cacheDb /*&& cacheDb.serverConfig.isConnected()*/) {
    console.log("Use exisiting connection.");
    return Promise.resolve(cacheDb);
  } else {
    return MongoClient.connect(DB_URI)
    .then((client) => {
      let db = client.db("test");
      console.log("New database connection.");
      cacheDb = db;
      return cacheDb;  
    })
    .catch((error) => {
      console.log("MongoDB connection error:");
      console.log(error);
    });
  }
};


// Define a route
api.get('/products', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("products");
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    res.json({message: err});
  }
  
});

api.get('/products/:productId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("products");
    const product = await collection.findOne({}, req.params.productId);
    res.json(product);
  } catch (err) {
    res.json({message: err});
  }
});

api.post('/post-order', async (req, res) => {
  try {
    const new_product = req.body;
  
    const db = await connectToDatabase();
    const collection = await db.collection("orders");
    const product = await collection.insertOne(new_product);
    res.json(product);

    let details;

    new_product.items.map((item) => {
      details += "Product: "+item.title +", Price: "+item.price+" | "
    })

    return {
      "message": "Sending email to "+new_product.customer.email,
      "order_detail": details.replace("undefined", "")
    }

  } catch (err) {
    res.json({message: err});
  }
});

// Declare your Lambda handler
module.exports.endpoints = async (event, context) => {
  // Run the request
  return await api.run(event, context);
};
