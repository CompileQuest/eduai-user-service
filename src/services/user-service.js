import UserRepository from "../database/repository/user-repository.js";
import {
    FormateData,
} from "../utils/index.js";
import { APIError, AppError, BadRequestError, InternalServerError, NotFoundError } from "../utils/app-errors.js";
import bcrypt from "bcrypt";
import ResponseHelper from "../utils/responseHelper.js";
import httpClient from "../services/external/httpClient.js";
import services from "../services/external/services.js"; // Import the services configuration
import { validate as uuidValidate } from "uuid";
import HttpClient from "../services/external/httpClient.js";
import EVENTS from "./external/events.js";

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

            // here if there is no course i will just return an empty array which is better :) 
            return OwnedCourses || [];
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Failed to fetch related courses', error.message);
        }
    }




    async doesUserOwnsThisCousre(userId, courseId) {
        try {

            console.log("this si the user id ", userId);
            console.log("this si the course id ", courseId);
            // fetch Owned Courses
            const ownedCourses = await this.repository.getOwnedCourses(userId);


            // array of courses here now i need to check if the courseId is in there or not !!
            console.log("this is owned courses", ownedCourses);
            const ownsCourse = ownedCourses.some(id => id.toString() === courseId.toString());

            // here if there is no course i will just return an empty array which is better :) 
            return ownsCourse || false;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Failed to fetch related courses', error.message);
        }
    }






    async getUserLearningCourses(userId) {
        try {

            // fetch Owned Courses
            const ownedCourses = await this.repository.getOwnedCourses(userId);
            console.log("this is the owned courses ", ownedCourses);
            const payload = {
                ownedCourses: ownedCourses,
                userId: userId
            }
            const result = this.externalService.callService(services.courseService, EVENTS.USER_OWNS_COURSE, payload)
            console.log("this is the result ", result);

            // here if there is no course i will just return an empty array which is better :) 
            return result || false;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Failed to fetch related courses', error.message);
        }
    }
    // what is the difference bewteen having 





    async getUserCart(userId) {
        try {
            // Check if userId is provided
            if (!userId) {
                throw new BadRequestError("User ID is required");
            }

            // Fetch the user's cart from the repository
            const cart = await this.repository.getUserCart(userId);


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
            const courseIdsArray = Array.isArray(courseIds) ? courseIds : [courseIds];

            const courseIdsPayload = FormateData(courseIdsArray);

            const courseDetailsResponse = await this.externalService.callService(
                services.courseService,
                'course.cart.info',
                courseIdsPayload
            );

            const courseDetails = courseDetailsResponse;

            if (!Array.isArray(courseDetails) || courseDetails.length === 0) {
                throw new NotFoundError("No course details found", "Make sure the course IDs are valid.");
            }

            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found", `No user with ID ${userId}`);
            }

            const existingCourseIds = user.cart.map(item => item.course_id);

            // Filter out duplicates
            const newCourses = courseDetails
                .filter(course => !existingCourseIds.includes(course.id))
                .map(course => ({
                    course_id: course.id,
                    course_name: course.title,
                    price: course.price,
                    thumbnail: course.thumbnailUrl
                }));

            if (newCourses.length === 0) {
                return {
                    success: true,
                    message: "No new courses to add. All courses are already in cart.",
                    data: user.cart
                };
            }

            const updatedCart = await this.repository.addCartItems(userId, newCourses);

            return {
                success: true,
                message: "Courses added to cart successfully",
                data: updatedCart
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new APIError("Failed to add courses to cart", error.message);
        }
    }



    // Method to remove courses from the user's cart
    async deleteAllCartItems(userId) {
        try {

            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found", `No user with ID ${userId}`);
            }

            const updatedCart = await this.repository.deleteAllCartItems(userId);

            return {
                success: true,
                message: "Courses removed from cart successfully",
                data: updatedCart
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new APIError("Failed to remove courses from cart", error.message);
        }
    }




    // Method to remove courses from the user's cart
    async deleteFromCart(userId, courseIds) {
        try {
            const courseIdsArray = Array.isArray(courseIds) ? courseIds : [courseIds];

            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found", `No user with ID ${userId}`);
            }

            const existingCourseIds = user.cart.map(item => item.course_id);
            const validCourseIds = courseIdsArray.filter(id => existingCourseIds.includes(id));

            if (validCourseIds.length === 0) {
                return {
                    success: true,
                    message: "No matching courses in cart to remove.",
                    data: user.cart
                };
            }

            const updatedCart = await this.repository.removeCartItems(userId, validCourseIds);

            return {
                success: true,
                message: "Courses removed from cart successfully",
                data: updatedCart
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new APIError("Failed to remove courses from cart", error.message);
        }
    }



    async purchaseCourse(userId, courseId) {
        try {
            if (!uuidValidate(courseId)) {
                throw new ValidationError("Invalid Course ID", "Course ID must be a valid UUID");
            }

            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found", `No user with ID ${userId}`);
            }

            const updatedPurchases = await this.repository.purchaseCourse(userId, courseId);

            return {
                success: true,
                message: "Course was successfully purchased",
                data: updatedPurchases
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new APIError("Failed to add course to purchases", error.message);
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
            return user
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

    async findUserById(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required to retrieve user");
            }

            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found");
            }
            return user;
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
