// Import the required package
const redis = require("redis");

// Class to handle the Redis client instance
class RedisHandler {
  // Private member which holds the Redis client instance
  #redisClient;

  // Constructor function to create only a single instance of the class
  constructor() {
    // Check if the instance is not null, then return the same instance
    if (RedisHandler.singleInstance) return RedisHandler.singleInstance;
    // Else return the current newly created instance denoted by this keyword
    else RedisHandler.singleInstance = this;
  }

  // Initialization function to create the Redis client and connect to Redis
  init = async () => {
    // Return if the Redis client instance already created
    if (this.#redisClient) return;

    // Create the Redis client and connect to Redis
    this.#redisClient = redis.createClient();
    this.#redisClient.connect();
  };

  // Getter function to get the Redis client instance
  getRedisClient() {
    // Return the Redis client instance if not null
    if (this.#redisClient) return this.#redisClient;

    // If no Redis client exists, then create the Redis client,
    // connect to the Redis and then return it
    this.#redisClient = redis.createClient();
    this.#redisClient.connect();
    return this.#redisClient;
  }
}

// Create an object/instance of the RedisHandler class
const redisHandlerInstance = new RedisHandler();

// Export the instance of this singleton class
module.exports = redisHandlerInstance;
