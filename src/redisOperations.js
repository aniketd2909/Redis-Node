// Import the required package
const redis = require("redis");

// Create the Redis client object
const client = redis.createClient();

// An async function to perform few Redis operations
const performRedisOperations = async () => {
  // Connect to the Redis server
  await client.connect();

  // Set a key-value pair in Redis
  await client.set("website", "educative");

  // Retrieve all the keys present in Redis
  const allKeys = await client.keys("*");

  // Retrieve the value store for the key 'webiste'
  const data = await client.get("website");

  // Disconnect with Redis
  await client.disconnect();

  // Return the response in an object form
  return { keys: allKeys, website: data };
};

// Export the funtion to be used by other modules
module.exports = {
  performRedisOperations,
};
