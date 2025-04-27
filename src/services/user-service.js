import UserRepository from "../database/repository/user-repository.js";
import {
    FormateData,
} from "../utils/index.js";
import { APIError, AppError, BadRequestError, NotFoundError } from "../utils/app-errors.js";
import bcrypt from "bcrypt";
import ResponseHelper from "../utils/responseHelper.js";
import httpClient from "../services/external/httpClient.js";
import services from "../services/external/services.js"; // Import the services configuration


// All Business logic will be here
class UserService {
    constructor() {
        this.repository = new UserRepository();
        this.externalService = new httpClient();
    }






    //////////////////////////////////////////
    async AddUser(userData) {
        const { email, role, userId, username, emailVerfied, userTimeJoined } = userData; // Destructure userId from the input
        try {
            // Call CreateUser and pass the userId, email, and hashed password
            const newUser = await this.repository.CreateUser({
                email,
                userId,  // Include the userId
                role,
                username,
                emailVerfied,
                userTimeJoined
            });

            // Return the formatted result
            return ResponseHelper.success("created user successfuly", newUser);
        } catch (err) {
            console.log(err.message);
            throw new APIError("User Creation Error", err.message, true);
        }
    }

    async getOwnedCourses(UserId) {
        try {
            // fetch Owned Courses
            const OwnedCourses = await this.repository.getOwnedCourses(UserId);
            console.log("this is owned courses", OwnedCourses);


            if (!OwnedCourses || OwnedCourses.length === 0) {
                return ResponseHelper.error("No owned courses found", 404);
            }


            // Return success response with the transformed courses
            return ResponseHelper.success('Owned Courses Fetched Successfully ', OwnedCourses);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            return ResponseHelper.error('Failed to fetch related courses', 500);
        }
    }

    async getUserCart(userId) {
        try {
            // Check if userId is provided
            if (!userId) {
                throw new BadRequestError("User ID is required");
            }

            // Fetch the user's cart from the repository
            const cart = await this.repository.getUserCart(userId);

            // Check if the cart is empty
            if (!cart || cart.length === 0) {
                throw new NotFoundError("Cart not found", "The requested cart does not exist.");
            }

            // Return success response with the cart data
            return cart;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new APIError("Failed to fetch user cart", error.message);
        }
    }


    // Method to add a course to the user's cart
    async addToCart(userId, courseIds) {
        try {
            // Ensure courseIds is an array, even if it is a single courseId
            const courseIdsArray = Array.isArray(courseIds) ? courseIds : [courseIds];

            // Pass the array of courseIds to FormateData
            const courseIdsPayload = FormateData(courseIdsArray);

            // Fetch the course details from the course service
            const courseDetails = await this.externalService.callService(
                services.courseService, // Service name
                'courseInfo.cart', // Event or endpoint
                courseIdsPayload // Pass the HttpMessage as the payload
            );

            console.log("This is the course details:", courseDetails);

            // Call the repository method to add the courses to the user's cart
            const updatedCart = await this.repository.addToCart(userId, courseIdsArray);

            // Check if the courses were successfully added
            if (!updatedCart) {
                throw new NotFoundError("Courses not found", "One or more courses do not exist.");
            }

            // Return the updated cart data
            return updatedCart;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new APIError("Failed to add courses to cart", error.message);
        }
    }


    async deleteUserById(userId) {
        try {
            // Check if userId is provided
            if (!userId) {
                throw new BadRequestError("User ID is required");
            }


            console.log("block 1 ");

            // Call the repository method to delete the user
            const deletedUser = await this.repository.deleteUserById(userId);

            console.log("this is the deleted user", deletedUser);
            // Check if the user was successfully deleted
            if (!deletedUser) {
                console.log("block 2 ");
                throw new NotFoundError("User not found", "The requested user does not exist.");
            }

            // Return success response
            return deletedUser;
        } catch (error) {
            if (error instanceof AppError) {
                console.log("hell ohere 3 ");
                throw error;
            }
            console.log("hell ohere 4 ");
            return ResponseHelper.error("Failed to delete user", 500);
        }
    }

    async checkIfUserExistByUserName(username) {
        try {

            console.log("this is the username ", username)
            // Check if user exists in the repository
            const user = await this.repository.checkIfUserExistByUserName(username);
            console.log("This is the user: ", user);

            if (!user) {
                // If user is not found, return an error response with a 404 status
                return ResponseHelper.success('User not found', false);
            }

            // User exists, return success with the user data (if necessary)
            return ResponseHelper.success('User found successfully', true);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            // Return a generic error response in case of an unexpected error
            return ResponseHelper.error('Failed to check if user exists', 500);
        }
    }



    ////////////all users ////////////////////////

    async GetAllUsers() {
        try {
            const users = await this.repository.GetAllUsers();

            // Format the data if necessary
            const formattedUsers = users.map((user) => ({
                id: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            }));

            return formattedUsers;
        } catch (err) {
            console.error(err);
            throw new APIError("User Retrieval Error", undefined, err.message, true);
        }
    }
    ///////////get user by id////////////////////

    async GetUser(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required to retrieve user");
            }

            const user = await this.repository.GetUserById(userId);

            return FormateData(user);
        } catch (err) {
            console.error("Service Error Fetching User:", err);
            throw new APIError("User Retrieval Error", undefined, err.message, true);
        }
    }

    ////delete user/////


    /////////////update user //////////////////////////

    async UpdateUser(userId, updates) {
        try {
            if (!userId) {
                throw new Error("User ID is required to update a user");
            }

            if (!updates || Object.keys(updates).length === 0) {
                throw new Error("Update data is required");
            }
            //console.log(updates);
            const updatedUser = await this.repository.UpdateUserById(userId, updates);
            //console.log(updatedUser);
            return FormateData(updatedUser); // Return formatted data
        } catch (err) {
            console.error("Service Error Updating User:", err);
            throw new APIError("User Update Error", undefined, err.message, true);
        }
    }
    //////////notificaiton settings////////////////////

    async GetNotificationSettings(userId) {
        try {
            const notificationSettings =
                await this.repository.GetNotificationSettings(userId);

            return FormateData(notificationSettings); // Format the response if needed
        } catch (err) {
            console.error("Service Error Fetching Notification Settings:", err);
            throw new APIError(
                "Notification Retrieval Error",
                undefined,
                err.message,
                true
            );
        }
    }

    async UpdateNotificationSettings(userId, notificationSettings) {
        try {
            const updatedSettings = await this.repository.UpdateNotificationSettings(
                userId,
                notificationSettings
            );

            return FormateData(updatedSettings); // Format the response if needed
        } catch (err) {
            console.error("Service Error Updating Notification Settings:", err);
            throw new APIError(
                "Notification Update Error",
                undefined,
                err.message,
                true
            );
        }
    }
    ////////prpfile pic////////////////////////
    async UpdateProfileImage(userId, profileImageUrl) {
        try {
            if (!profileImageUrl || !/^https?:\/\/.+$/.test(profileImageUrl)) {
                throw new Error("Invalid profile image URL provided");
            }

            const updatedImageUrl = await this.repository.UpdateProfileImage(
                userId,
                profileImageUrl
            );

            return FormateData({ profile_picture_url: updatedImageUrl });
        } catch (err) {
            console.error("Service Error Updating Profile Image:", err);
            throw new APIError(
                "Profile Image Update Error",
                undefined,
                err.message,
                true
            );
        }
    }

    /////////////////////////////////////////////************////////////////////////
    async GetProfile(id) {
        try {
            const existingCustomer = await this.repository.FindCustomerById({ id });
            return FormateData(existingCustomer);
        } catch (err) {
            throw new APIError("Data Not found", err);
        }
    }

    // this is giong to take care of the communication with other services
    async SubscribeEvents(payload) {
        const { event, data } = payload;
        switch (event) {
            case "CREATE_USER":
                return await this.AddUser(data);
                break;
            case "TESTING":
                console.log("Working --- Subscriber");
                break;
            default:
                break;
        }
    }
}

export default UserService;
