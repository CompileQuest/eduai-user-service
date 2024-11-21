const UserService = require('../../services/user-service')
const UserAuth = require("../middlewares/auth");

// Todo : 
module.exports = (app) => {
    const service = new UserService();


    app.post("/signup", async (req, res, next) => {
        try {
          const { email, password } = req.body;
      
          const { data } = await service.AddUser(email, password);
      
          return res.status(201).json(data);
        } catch (err) {
          next(err);
        }
      });

//      all users
   app.get('/users', async (req, res, next) => {
        try {
          const users = await service.GetAllUsers();
          res.status(200).json(users); // Send users as a JSON response
        } catch (err) {
          next(err); 
        }
      });
///////////get user by id////////

app.get('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params; 

        const user = await service.GetUser(id.trim());

        return res.status(200).json({
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (err) {
        next(err); 
    }
});


      ////delete user/////
      app.delete('/users/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const cleanedId = id.trim();  // Clean the ID to avoid issues like newlines
    
            // Call the service to delete the user by their UUID
            const deletedUser = await service.DeleteUserById(cleanedId);
    
            return res.status(200).json({
                message: 'User deleted successfully',
                data: deletedUser,
            });
        } catch (err) {
            next(err); // Handle any errors
        }
    });
    
    
///////update user/////


app.put('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params; 
        const updates = req.body; 

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        const updatedUser = await service.UpdateUser(id, updates);

        return res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (err) {
        next(err); 
    }
});




    
/////////////////////////////////////////////////////////////////////
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