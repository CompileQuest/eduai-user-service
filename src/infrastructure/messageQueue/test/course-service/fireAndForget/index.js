const rabbitMQClient = require('./RabbitMQClient'); // Import the RabbitMQ client
const { RoutingKeys } = require('./routingKeys'); // Import routing keys
const Message = require('./messageTemplate'); // Import the Message class

// Simulate the course service
async function simulateCourseService() {
    console.log("Simulating Course Service...");

    // Simulate a course creation event
    const courseCreatedPayload = {
        courseId: "456",
        title: "Introduction to RabbitMQ",
        instructor: "Jane Doe",
    };
    const courseCreatedMessage = new Message(RoutingKeys.COURSE_CREATED, "course_service", courseCreatedPayload);
    await rabbitMQClient.produce(RoutingKeys.COURSE_CREATED, courseCreatedMessage);
    console.log("Course Service: Published COURSE_CREATED event.");
}

// Main function to run the simulation
async function main() {
    try {
        // Wait for RabbitMQ client to initialize
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds for initialization

        // Simulate the course service
        await simulateCourseService();

        // Keep the process alive to allow message consumption
        console.log("Course Service: Waiting for messages...");
        setTimeout(() => {
            console.log("Course Service: Simulation complete.");
            process.exit(0); // Exit after 10 seconds
        }, 10000); // Wait 10 seconds for messages to be consumed
    } catch (error) {
        console.error("Error in Course Service simulation:", error);
        process.exit(1); // Exit with error code
    }
}

// Run the simulation
main();