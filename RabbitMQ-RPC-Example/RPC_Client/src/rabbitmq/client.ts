import { Channel, Connection, connect } from "amqplib"; // Importing necessary methods from the amqplib library for RabbitMQ communication
import config from "../config"; // Importing configuration (like RabbitMQ connection URL)
import Consumer from "./consumer"; // Import the Consumer class to handle message consumption
import Producer from "./producer"; // Import the Producer class to handle message production
import { EventEmitter } from "events"; // Import the EventEmitter class to emit events for message handling

// 1. Singleton pattern: This class follows the singleton design pattern to ensure only one instance of RabbitMQClient is created
class RabbitMQClient {
  private constructor() {} // Private constructor to prevent direct instantiation

  private static instance: RabbitMQClient; // Static instance variable to hold the singleton instance
  private isInitialized = false; // Flag to track whether the RabbitMQClient has been initialized

  private producer: Producer; // Producer instance for sending messages
  private consumer: Consumer; // Consumer instance for receiving messages
  private connection: Connection; // Connection object to interact with RabbitMQ
  private producerChannel: Channel; // Channel for producing messages
  private consumerChannel: Channel; // Channel for consuming messages

  private eventEmitter: EventEmitter; // EventEmitter to handle communication between producer and consumer

  // 2. Static method to get the instance of RabbitMQClient (Singleton)
  public static getInstance() {
    if (!this.instance) {
      // If no instance exists
      this.instance = new RabbitMQClient(); // Create a new instance
    }
    return this.instance; // Return the existing or new instance
  }

  // 3. Initialize method that sets up the connection and channels for RabbitMQ communication
  async initialize() {
    if (this.isInitialized) {
      // If already initialized, do nothing
      return;
    }
    try {
      // 4. Establish connection to RabbitMQ using URL from config
      this.connection = await connect(config.rabbitMQ.url);

      // 5. Create channels for both producer and consumer
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      // 6. Declare an exclusive queue for the consumer. The queue will be deleted once the connection is closed.
      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        { exclusive: true }
      );

      // 7. Instantiate the EventEmitter which will be used to emit and listen to events for message handling
      this.eventEmitter = new EventEmitter();

      // 8. Create Producer and Consumer instances using the channels and the reply queue
      this.producer = new Producer(
        this.producerChannel,
        replyQueueName,
        this.eventEmitter
      );
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this.eventEmitter
      );

      // 9. Start consuming messages in the consumer instance
      this.consumer.consumeMessages();

      // 10. Mark the client as initialized
      this.isInitialized = true;
    } catch (error) {
      // 11. Handle initialization errors
      console.log("rabbitmq error...", error);
    }
  }

  // 12. Method to send (produce) messages
  async produce(data: any) {
    if (!this.isInitialized) {
      // If RabbitMQClient is not initialized, initialize it first
      await this.initialize();
    }
    // 13. Use the producer to send the provided data
    return await this.producer.produceMessages(data);
  }
}

// 14. Export the singleton instance of RabbitMQClient for use in other parts of the application
export default RabbitMQClient.getInstance();
