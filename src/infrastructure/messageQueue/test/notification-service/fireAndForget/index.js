const rabbitMQClient = require('./rabbitMQClient'); // Import the RabbitMQ client
const { RoutingKeys } = require('./routingKeys'); // Import routing keys

// Simulate the user service
async function simulateUserService() {
    console.log("Simulating User Service...");

    // Simulate a user creation event
    const userCreatedPayload = {
        userId: "123",
        name: "John Doe",
        email: "john.doe@example.com",
    };
    await rabbitMQClient.produce(RoutingKeys.USER_CREATED, userCreatedPayload);
    console.log("User Service: Published USER_CREATED event.");

    // Simulate a user deletion event
    const userDeletedPayload = {
        userId: "123",
    };
    await rabbitMQClient.produce(RoutingKeys.USER_DELETED, userDeletedPayload);
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