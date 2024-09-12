// Importing the required modules
const express = require("express");

// Importing the function to perform Redis operations
const RedisHandler = require("./redisHandler");
const { calculatePowerOfTwo } = require("./calculatePower");
const { getRecentSearchTerms } = require("./recentSearch.js");

// Instantiating an object express
const app = express();

// Using a middleware to parse the JSON sent in the request body
app.use(express.json());

// Using the express object, handle the '/' route for GET requests
app.get("/calculate-power/:num", async (req, res) => {
  // Add default value for power to be 1
  if (!req.params.num) req.params.num = 1;

  // Calculate the result of 2 to power of num
  const responseToSend = await calculatePowerOfTwo(req.params.num);
  return res.json(responseToSend);
});

app.get("/search", async (req, res) => {
  // Throw an error if there is no search query provided
  if (!req.query.searchQuery)
    return res.json({ error: "Provide a search query!!" });

  // Call the function to get a list of recent search terms
  const responseToSend = await getRecentSearchTerms(req.query.searchQuery);

  // Return the response
  return res.json(responseToSend);
});

app.get("/joke/:category", async (req, res) => {
  // Setting default value of category to Programming
  if (!req.params.category) req.params.category = "Programming";

  // Verifying that the category is either Programming or Pun
  if (!["Programming", "Pun"].includes(req.params.category))
    return res.json({ error: "Category is not valid!!" });

  // Calling the getJokes() function to fetch the jokes for the given category
  const responseToSend = await getJokes(req.params.category);

  // Returning the JSON response to the user
  return res.json(responseToSend);
});

// Using the express object, handle the '/' route for GET requests
app.get("/product/:productId/purchase/", async (req, res) => {
  // Checking if the product id is not sent in the request
  if (!req.params.productId)
    return res.json({ error: "Product Id not valid!" });

  // Fetching all the product from the JSON file
  const allProducts = await fs.readFileSync("products.json");

  // Parsing the data to JSON and find the product that matches
  // the given productId
  const product = JSON.parse(allProducts).find(
    (item) => item.id == req.params.productId
  );

  // Calling the function to purchase the product
  const responseToSend = await pruchaseProduct(product);

  // Returning the JSON response
  return res.json(responseToSend);
});

// Using the express object to listen to port 8000 for incoming requests
app.listen(8000, async () => {
  // Initializing the Redis instance
  await RedisHandler.init();

  // Setting the initial current balance to 5000
  await RedisHandler.getRedisClient().set("currentBalance", 5000);

  console.log(`Listening on port 80!`);
});
