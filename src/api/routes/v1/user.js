const UserService = require('../../../services/user-service')
const UserAuth = require("../../middlewares/auth");
const express = require('express');

    const service = new UserService();
    const router = express.Router();


    router.get("/", async (req, res, next) => {
        console.log("hello");
        try {
            res.status(200).send('<html><body><h1>user servive is working </h1></body></html>');
        } catch (err) {
            next(err);
        }
    });



    router.post("/signup", async (req, res, next) => {
        try {
            const userData = req.body;
            const { data } = await service.AddUser(userData);
            return res.status(201).json(data);
        } catch (err) {
            next(err);
        }
    });

    // //      all users
    // app.get('/users', async (req, res, next) => {
    //     try {
    //         const users = await service.GetAllUsers();
    //         res.status(200).json(users); // Send users as a JSON response
    //     } catch (err) {
    //         next(err);
    //     }
    // });
    // ///////////get user by id////////

    // app.get('/users/:id', async (req, res, next) => {
    //     try {
    //         const { id } = req.params;

    //         const user = await service.GetUser(id.trim());

    //         return res.status(200).json({
    //             message: 'User retrieved successfully',
    //             data: user,
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });


    // ////delete user/////
    // app.delete('/users/:id', async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    //         const cleanedId = id.trim();  // Clean the ID to avoid issues like newlines
    
    //         // Call the service to delete the user by their UUID
    //         const deletedUser = await service.DeleteUserById(cleanedId);
    
    //         return res.status(200).json({
    //             message: 'User deleted successfully',
    //             data: deletedUser,
    //         });
    //     } catch (err) {
    //         next(err); // Handle any errors
    //     }
    // });
    
    
    // ///////update user/////


    // app.put('/users/:id', async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    //         const updates = req.body;

    //         if (!updates || Object.keys(updates).length === 0) {
    //             return res.status(400).json({ message: 'No updates provided' });
    //         }

    //         const updatedUser = await service.UpdateUser(id, updates);

    //         return res.status(200).json({
    //             message: 'User updated successfully',
    //             data: updatedUser,
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });
    // //update specific fields
    // app.put('/users/:id/details', async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    //         const {
    //             first_name,
    //             last_name,
    //             phone,
    //             birthday,
    //             address_line_1,
    //             address_line_2,
    //             state,
    //             country
    //         } = req.body;

    //         // Ensure at least one field is being updated
    //         if (
    //             !first_name && !last_name && !phone && !birthday &&
    //             !address_line_1 && !address_line_2 && !state && !country
    //         ) {
    //             return res.status(400).json({ message: 'No valid fields provided for update' });
    //         }

    //         // Prepare the updates object dynamically
    //         const updates = {};
    //         if (first_name) updates.first_name = first_name;
    //         if (last_name) updates.last_name = last_name;
    //         if (phone) updates.phone = phone;
    //         if (birthday) updates.birthday = new Date(birthday); // Convert birthday to Date
    //         if (address_line_1) updates.address_line_1 = address_line_1;
    //         if (address_line_2) updates.address_line_2 = address_line_2;
    //         if (state) updates.state = state;
    //         if (country) updates.country = country;

    //         // Call service to update user details
    //         const updatedUser = await service.UpdateUser(id, updates);

    //         return res.status(200).json({
    //             message: 'User details updated successfully',
    //             data: updatedUser,
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // ///////notification settings/////

    // ////coarse-grained access control////
    // app.route('/users/:id/notification-settings')
    //     .get(async (req, res, next) => {
    //         try {
    //             const { id } = req.params;
    //             const notificationSettings = await service.GetNotificationSettings(id.trim());
    //             res.status(200).json(notificationSettings);
    //         } catch (err) {
    //             next(err);
    //         }
    //     })
    //     .put(async (req, res, next) => {
    //         try {
    //             const { id } = req.params;
    //             const { body: notificationSettings } = req;

    //             const updatedSettings = await service.UpdateNotificationSettings(id.trim(), notificationSettings);

    //             return res.status(200).json({
    //                 message: 'Notification settings updated successfully',
    //                 data: updatedSettings,
    //             });
    //         } catch (err) {
    //             next(err);
    //         }
    //     });
    // //////fine-grained access control/////
    // app.get('/users/:id/notification-settings/:field', async (req, res, next) => {
    //     try {
    //         const { id, field } = req.params;

    //         const notificationSettings = await service.GetNotificationSettings(id.trim());

    //         if (!notificationSettings.hasOwnProperty(field)) {
    //             return res.status(404).json({ message: `Field "${field}" not found in notification settings` });
    //         }

    //         res.status(200).json({
    //             field: field,
    //             value: notificationSettings[field],
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // app.put('/users/:id/notification-settings/:field', async (req, res, next) => {
    //     try {
    //         const { id, field } = req.params;
    //         const { value } = req.body;

    //         const notificationSettings = await service.GetNotificationSettings(id.trim());

    //         if (!notificationSettings.hasOwnProperty(field)) {
    //             return res.status(404).json({ message: `Field "${field}" not found in notification settings` });
    //         }

    //         notificationSettings[field] = value;

    //         const updatedSettings = await service.UpdateNotificationSettings(id.trim(), notificationSettings);

    //         res.status(200).json({
    //             message: `Notification setting "${field}" updated successfully`,
    //             data: updatedSettings[field],
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });
    // /////////profile pic/////

    // app.put('/users/:id/profile-image', async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    //         const { profile_picture_url } = req.body;

    //         if (!profile_picture_url) {
    //             return res.status(400).json({ message: 'Profile image URL is required' });
    //         }

    //         const updatedProfileImage = await service.UpdateProfileImage(id.trim(), profile_picture_url);

    //         return res.status(200).json({
    //             message: 'Profile image updated successfully',
    //             data: updatedProfileImage,
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // });



    // //********************************************************************************************************************    
    // app.post("/login", async (req, res, next) => {
    //     try {
    //         const { email, password } = req.body;

    //         const { data } = await service.SignIn({ email, password });

    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });


    // app.post("/address", UserAuth, async (req, res, next) => {
    //     try {
    //         const { _id } = req.user;

    //         const { street, postalCode, city, country } = req.body;

    //         const { data } = await service.AddNewAddress(_id, {
    //             street,
    //             postalCode,
    //             city,
    //             country,
    //         });

    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // app.get("/profile", UserAuth, async (req, res, next) => {
    //     try {
    //         const { _id } = req.user;
    //         const { data } = await service.GetProfile({ _id });
    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });


    // app.get("/shoping-details", UserAuth, async (req, res, next) => {
    //     try {
    //         const { _id } = req.user;
    //         const { data } = await service.GetShopingDetails(_id);

    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // app.get("/wishlist", UserAuth, async (req, res, next) => {
    //     try {
    //         const { _id } = req.user;
    //         const { data } = await service.GetWishList(_id);
    //         return res.status(200).json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

module.exports = router;