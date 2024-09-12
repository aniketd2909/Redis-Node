// Import the required module
const RedisHandler = require("./redisHandler");

// Function to get the list of recent search terms
const getRecentSearchTerms = async (searchQuery) => {
  // Get the Redis client instance
  const redisClient = RedisHandler.getRedisClient();

  // Get the list of search terms from Redis
  const searchQueryList = await redisClient.lRange("searchQuery", 0, -1);

  // Check if the search terms in Redis exceeds five
  if (searchQueryList.length >= 5) {
    // Remove the leftmost element from the search terms list
    const removedSearchQuery = await redisClient.lPop("searchQuery");

    // Insert the new search terms to the rightmost position of the list
    await redisClient.rPush("searchQuery", searchQuery);

    // Fetch the updated search terms list from Redis
    const updatedSearchQueryList = await redisClient.lRange(
      "searchQuery",
      0,
      -1
    );

    // Return the response
    return {
      searchQueryList: updatedSearchQueryList,
      removedSearchQuery,
    };
  }
  // If there are less than five search terms in the list
  else {
    // Insert the new search terms to the rightmost position of the list
    await redisClient.rPush("searchQuery", searchQuery);

    // Fetch the updated search terms list from Redis
    const updatedSearchQueryList = await redisClient.lRange(
      "searchQuery",
      0,
      -1
    );

    // Return the response
    return {
      searchQueryList: updatedSearchQueryList,
      removedSearchQuery: null,
    };
  }
};

// Export the funtion to be used by external files or modules
module.exports = {
  getRecentSearchTerms,
};
