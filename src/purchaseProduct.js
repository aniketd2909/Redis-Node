// Import the RedisHandler instance
const RedisHandler = require("./redisHandler");

// Function to purchase the given product
const pruchaseProduct = async (product) => {
  // Get the Redis client instance
  const redisClient = RedisHandler.getRedisClient();

  // Fetch the current balance available to purchase products
  const currentBalance = await redisClient.get("currentBalance");

  // Check if the product is NULL, return the response with a message
  if (!product)
    return {
      product,
      message: "Product not found!",
      currentBalance,
    };

  // Check if the current balance is not enough to purchase the product
  if (currentBalance < product.price)
    return {
      product,
      message: "Insufficient funds!",
      currentBalance,
    };

  // Start the Redis transaction
  const transaction = redisClient.multi();

  // Deduct product price from the current balance
  const remainingBalance = currentBalance - product.price;

  // Update the current balance
  transaction.set("currentBalance", remainingBalance);

  // Add product Id to the list of purchased items
  transaction.rPush("purchasedItems", product.id.toString());

  try {
    // Execute the transaction
    const replies = await transaction.exec();
    console.log(replies);
    return {
      product,
      message: "Product purchased successfully",
      remainingBalance,
    };
  } catch (e) {
    // Handle any errors occurred while executing the transaction
    return {
      product,
      message: e,
      remainingBalance,
    };
  }
};

// Export the function to be used by external files or modules
module.exports = {
  pruchaseProduct,
};
