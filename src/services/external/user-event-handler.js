
import UserService from "../user-service.js";
import EVENTS from "./events.js";
class userHttpHandler {
    constructor() {
        this.userService = new UserService();
        this.handleDoesUserOwnsCourse = this.handleDoesUserOwnsCourse.bind(this);
        this.handleUnknownMessage = this.handleUnknownMessage.bind(this);
        // Use routing keys instead of hardcoded strings
        this.handlers = {
            [EVENTS.USER_OWNS_COURSE]: this.handleDoesUserOwnsCourse,
        };
    }

    async handleMessage(message) {
        const { type, payload } = message;
        const handler = this.handlers[type] || this.handleUnknownMessage;
        return await handler(payload, type);
    }

    async handleDoesUserOwnsCourse(payload, type) {
        console.log("From Event Handler  this is the event ", type);
        console.log("From Event Handler this is the payload ", payload);

        const { userId, courseId } = payload.data;
        console.log("this is the user id ", userId);
        console.log("this is the cousre id ", courseId);

        try {
            const doesUserOwnsCourse = await this.userService.doesUserOwnsThisCousre(userId, courseId);
            return {
                success: true,
                message: `Successfully handled ${type}`,
                data: doesUserOwnsCourse,
            };
        } catch (error) {
            console.error(`❌ Failed to handle ${type}:`, error);
            return {
                success: false,
                message: `Failed to handle ${type}: ${error.message}`,
            };
        }
    }





    async handleUnknownMessage(payload, type) {
        console.warn(`❓ Unknown message type: ${type}`, payload);
        return { success: false, message: `Unknown message type: ${type}` };
    }
}

export default userHttpHandler;
