
import express from "express";
import userHttpHandler from "../../../services/external/user-event-handler.js";

const router = express.Router();
const messageHandler = new userHttpHandler();

// Expose a webhook for other services
router.post("/", async (req, res, next) => {
    try {
        const message = req.body; // Extract event type and payload
        console.log(`Received event: ${message.type}`);
        console.log("This is the payload ", message.payload)
        const result = await messageHandler.handleMessage(message);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});




router.post("/", async (req, res, next) => {
    try {
        const { type, payload } = req.body; // Extract event type and payload
        console.log(`Received event: ${type}`);
        console.log("This is the payload ", payload)
        const result = await handleEvent(type, payload);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});
export default router;
