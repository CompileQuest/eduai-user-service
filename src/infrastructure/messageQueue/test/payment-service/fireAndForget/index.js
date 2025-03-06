const rabbitMQClient = require('./RabbitMQClient'); // Import the RabbitMQ client
const { RoutingKeys } = require('./routingKeys'); // Import routing keys
const Message = require('./messageTemplate'); // Import the Message class

// Simulate the payment service
async function simulatePaymentService() {
    console.log("Simulating Payment Service...");

    // Simulate a payment completion event
    const paymentCompletedPayload = {
        userId: "123",
        courseId: "456",
        amount: 100,
        transactionId: "txn_789",
    };
    const paymentCompletedMessage = new Message(RoutingKeys.PAYMENT_COMPLETED, "payment_service", paymentCompletedPayload);
    await rabbitMQClient.produce(RoutingKeys.PAYMENT_COMPLETED, paymentCompletedMessage);
    console.log("Payment Service: Published PAYMENT_COMPLETED event.");
}

// Main function to run the simulation
async function main() {
    try {
        // Wait for RabbitMQ client to initialize
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds for initialization

        // Simulate the payment service
        await simulatePaymentService();

        // Keep the process alive to allow message consumption
        console.log("Payment Service: Waiting for messages...");
        setTimeout(() => {
            console.log("Payment Service: Simulation complete.");
            process.exit(0); // Exit after 10 seconds
        }, 10000); // Wait 10 seconds for messages to be consumed
    } catch (error) {
        console.error("Error in Payment Service simulation:", error);
        process.exit(1); // Exit with error code
    }
}

// Run the simulation
main();