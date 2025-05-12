import UserService from "../../services/user-service.js";
import AuthService from "../../services/auth-service.js";
import { RoutingKeys } from "./fireAndForget/settings/routingKeys.js";

class MessageHandler {
    constructor() {
        this.userService = new UserService();


        // Bind handlers 
        this.handlePaymentCompleted = this.handlePaymentCompleted.bind(this);
        this.handleUnknownMessage = this.handleUnknownMessage.bind(this);

        // Use routing keys instead of hardcoded strings
        this.handlers = {
            [RoutingKeys.PAYMENT_SESSION_COMPLETED]: this.handlePaymentCompleted,
        };
    }

    async handleMessage(message) {
        const { type, payload } = message;
        console.log("this si the message", message);
        console.log("this si the type ", type);
        const handler = this.handlers[type] || this.handleUnknownMessage;
        return await handler(payload, type);
    }


    async handlePaymentCompleted(payload, type) {
        console.log(`💰 [${type}] Payment Completed:`, payload);

        try {
            // Extract course IDs and user ID
            const courseIds = JSON.parse(payload.metadata.courseIds);
            const userId = payload.metadata.userId;

            console.log("User ID:", userId);
            console.log("Course IDs:", courseIds);

            // Ensure courseIds is an array
            if (!Array.isArray(courseIds)) {
                throw new Error("Invalid courseIds format");
            }

            // Use Promise.all to handle course purchases concurrently
            const purchaseResults = await Promise.all(
                courseIds.map(async (courseId) => {
                    return this.userService.purchaseCourse(userId, courseId);
                })
            );

            // Log results for all purchases
            purchaseResults.forEach((result, index) => {
                console.log(`Purchase result for Course ${courseIds[index]}:`, result);
            });

            return { success: true, message: `Handled ${type} successfully` };
        } catch (error) {
            console.error("Error while handling payment:", error);
            return { success: false, message: error.message };
        }
    }


    async handleUnknownMessage(payload, type) {
        console.warn(`❓ Unknown message type: ${type}`, payload);
        return { success: false, message: `Unknown message type: ${type}` };
    }
}

export default MessageHandler;
