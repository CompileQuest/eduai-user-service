module.exports = {
    rabbitMQ: {
        url: "amqps://eduai:pass-here@b-ae976da2-2915-4eb9-9de3-e0ed71858096.mq.eu-north-1.amazonaws.com:5671", // Change to your RabbitMQ server URL
        queues: ["user_task_queue", "user_event_queue"], // Define your queues here
    }
};
