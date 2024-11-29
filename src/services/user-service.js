const { UserRepository } = require("../database");
const {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");

const bcrypt = require("bcrypt");

// All Business logic will be here
class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    //////////////////////////////////////////
    async AddUser(userData) {
        const { email, password, role, userId, emailVerfied, userTimeJoined } = userData; // Destructure userId from the input

        try {
            // Generate a salt for password hashing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Call CreateUser and pass the userId, email, and hashed password
            const newUser = await this.repository.CreateUser({
                email,
                password_hash: hashedPassword,
                userId,  // Include the userId
                role,
                emailVerfied,
                userTimeJoined
            });

            // Return the formatted result
            return FormateData(newUser);
        } catch (err) {
            throw new APIError("User Creation Error", undefined, err.message, true);
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

    async DeleteUserById(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required to delete a user");
            }

            // Call the repository method
            const deletedUser = await this.repository.DeleteUserById(userId);

            return FormateData(deletedUser); // Return formatted data
        } catch (err) {
            console.error("Service Error Deleting User:", err);
            throw new APIError("User Deletion Error", undefined, err.message, true);
        }
    }

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

module.exports = UserService;
 