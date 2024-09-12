// Import the required libraries
const RedisHandler = require("./redisHandler");
const axios = require("axios");

// Function to fetch the jokes randomly based on the category
const getJokes = async (category) => {
  // Get the Redis client instance
  const redisClient = RedisHandler.getRedisClient();

  // Fetch the category set stored in redis
  const categorySet = await redisClient.sMembers(category);

  // Check if there are 5 or more jokes in the set
  if (categorySet.length > 5) {
    // Generate random integer between the range 0 to the number of jokes present in the set
    const randomIndex = Math.floor(Math.random() * categorySet.length);

    // Set the expiry of the set to 40 seconds
    await redisClient.expire(category, 40);

    // Return the response
    return {
      category,
      joke: categorySet[randomIndex],
      message: "Fetched from the Redis data store.",
    };
  }
  // If there are less than 5 jokes in the set
  else {
    // Fetch a new joke from a third party API based on the category
    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/${category}?type=single`
    );

    // Store the joke in the corresponding category set
    const joke = response.data.hasOwnProperty("joke") ? response.data.joke : "";
    await redisClient.sAdd(category, joke);

    // Return the response
    return {
      category,
      joke,
      message: "Fetched from API and store in the Redis data store.",
    };
  }
};

// Export the module to be consumed externally
module.exports = {
  getJokes,
};
