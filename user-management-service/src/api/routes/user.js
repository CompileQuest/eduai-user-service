const UserService = require('../../services/user-service')
const UserAuth = require("../middlewares/auth");


// Todo : 
module.exports = (app) => {
    const service = new UserService();


    app.post("/signup", async (req, res, next) => {
        try {
            const { email, password } = req.body;  // Only require email and password
    console.log(email+" "+password);
            // Call service method to create user
            const { data } = await service.AddUser(email, password);
    
            // Send the created user data as a response
            return res.status(201).json(data);  // 201 is the standard status code for resource creation
        } catch (err) {
            next(err);
        }
    });
    

    app.post("/login", async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { data } = await service.SignIn({ email, password });

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    app.post("/address", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;

            const { street, postalCode, city, country } = req.body;

            const { data } = await service.AddNewAddress(_id, {
                street,
                postalCode,
                city,
                country,
            });

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get("/profile", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile({ _id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    app.get("/shoping-details", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetShopingDetails(_id);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get("/wishlist", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetWishList(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
};