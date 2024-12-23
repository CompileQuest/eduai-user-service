
const UserService = require("../../../services/user-service")
const express = require('express');


    const service = new UserService();
    const router = express.Router();
    // exposing a webhook for other serivces 
    router.post('/app-events', async (req, res, next) => {
        const { payload } = req.body;
        console.log("user event gets " , payload )
        const result = await service.SubscribeEvents(payload);
        console.log("========= User Service received Event =========");
        res.status(200).json(result); 
    }) 

module.exports = router;