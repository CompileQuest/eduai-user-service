
import express from "express";
import UserService from "../../../services/user-service.js";


const userService = new UserService();
const router = express.Router();
// exposing a webhook for other serivces 
router.post('/app-events', async (req, res, next) => {
    const { payload } = req.body;
    console.log("user event gets ", payload)
    const result = await userService.SubscribeEvents(payload);
    console.log("========= User Service received Event =========");
    res.status(200).json(result);
})

export default router;