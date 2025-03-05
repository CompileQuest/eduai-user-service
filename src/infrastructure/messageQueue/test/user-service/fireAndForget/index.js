const rabbitMQClient = require('./RabbitMQClient'); // Import the RabbitMQ client
const { RoutingKeys } = require('./routingKeys'); // Import routing keys
const Message = require('./messageTemplate'); // Import the Message class

// Simulate the user service
async function simulateUserService() {
    console.log("Simulating User Service...");

    // Simulate a user creation event
    const userCreatedPayload = {
        userId: "123",
        name: "John Doe",
        email: "john.doe@example.com",
    };
    const userCreatedMessage = new Message(RoutingKeys.USER_CREATED, "user_service", userCreatedPayload);
    await rabbitMQClient.produce(RoutingKeys.USER_CREATED, userCreatedMessage);
    console.log("User Service: Published USER_CREATED event.");

    // Simulate a user deletion event
    const userDeletedPayload = {
        userId: "123",
    };
    const userDeletedMessage = new Message(RoutingKeys.USER_DELETED, "user_service", userDeletedPayload);
    await rabbitMQClient.produce(RoutingKeys.USER_DELETED, userDeletedMessage);
    console.log("User Service: Published USER_DELETED event.");
}

// Main function to run the simulation
async function main() {
    try {
        // Wait for RabbitMQ client to initialize
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds for initialization

        // Simulate the user service
        await simulateUserService();

        // Keep the process alive to allow message consumption
        console.log("User Service: Waiting for messages...");
        setTimeout(() => {
            console.log("User Service: Simulation complete.");
            process.exit(0); // Exit after 10 seconds
        }, 10000); // Wait 10 seconds for messages to be consumed
    } catch (error) {
        console.error("Error in User Service simulation:", error);
        process.exit(1); // Exit with error code
    }
}

// Run the simulation
main();