// Import our RedisHandler instance
const RedisHandler = require("./redisHandler");

// Function to calculate 2 to the power of num
const calculatePowerOfTwo = async (num) => {
  // Get the Redis client instance
  const redisClient = RedisHandler.getRedisClient();

  // Retrieve the value for the given power to calculate from Redis
  const data = await redisClient.get("2p_" + num);

  // If data is found, then return the result with a message
  if (data)
    return {
      result: data,
      message: "Fetched from Redis data store!!",
    };
  // Data not present in Redis
  else {
    // Calculate 2 to the power of num
    const result = 2 ** num;

    // Store the result with the key as 2p_num in Redis
    await redisClient.set("2p_" + num, result, (err, reply) => {
      if (err) throw err;
    });

    // Return the result with a message
    return {
      result,
      message: "Calculated and stored in Redis data store!!",
    };
  }
};

// Export the function to be used by external functions
module.exports = {
  calculatePowerOfTwo,
};
