
const UserService = require("../../services/user-service")

module.exports = (app) => {
    const service = new UserService();
    // exposing a webhook for other serivces 
    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body;
        console.log("user event gets " , payload )
        const result = await service.SubscribeEvents(payload);
        console.log("========= User Service received Event =========");
        res.status(200).json(result);
    }) 
}  
 