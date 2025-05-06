import HttpClient from "./external/httpClient.js";
import { APIError, InternalServerError, AppError, STATUS_CODES } from "../utils/app-errors.js";
import services from "./external/services.js";
import HttpMessage from "./external/HttpMessage.js"; // Import the HttpMessage class
import EVENTS from "./external/events.js";
import UserRoles from "supertokens-node/recipe/userroles";
import { deleteUser } from "supertokens-node";
import ResponseHelper from "../utils/responseHelper.js";
import supertokens from "supertokens-node";

class AuthService {
    constructor() {
        this.service = new HttpClient(); // Initialize HttpClient
    }

    /**
     * Create a user in the user service.
     * @param {object} payload - The user data to create.
     * @returns {Promise<object>} - The response from the user service.
     */
    async createUserInUserService(payload) {
        try {
            // Step 2: Call the user service to create a user
            const response = await this.service.callService(
                services.userService, // Service name
                EVENTS.USER_SERVICE.USER_CREATED, // Event or endpoint
                payload // Pass the HttpMessage as the payload
            );
            return response; // Return the response from the user service
        } catch (error) {
            if (error instanceof AppError) {
                // Re-throw custom errors (e.g., APIError, BadRequestError)
                console.log("here am iafdasf")
                throw error;
            } else {
                // Wrap unexpected errors in an InternalServerError
                throw new InternalServerError(
                    "An error occurred while creating the user.",
                    error.message // Include the original error message
                );
            }
        }
    }

    async userExitsInUserService(payload) {
        try {
            // Step 2: Call the user service to create a user
            const usernameExit = await this.service.callService(
                services.userService, // Service name
                'user.exists', // Event or endpoint
                payload // Pass the HttpMessage as the payload
            );

            if (usernameExit.data) {
                console.error("Username already exists");
                return AppError("Api Error", 409, "Username already exists", "Username already exists");
            }

            return true;
        } catch (error) {
            if (error instanceof AppError) {
                // Re-throw custom errors (e.g., APIError, BadRequestError)
                throw error;
            } else {
                // Wrap unexpected errors in an InternalServerError
                throw new InternalServerError(
                    "An error occurred while creating the user.",
                    error.message // Include the original error message
                );
            }
        }
    }


    async checkIfUserExistsInSuperTokens(userId) {

        try {
            let userInfo = await supertokens.getUser(userId)
            console.log("userInfo", userInfo);

            if (!userInfo) {
                return ResponseHelper.error("user was not foudn in supertokens");
            }

            return ResponseHelper.success("user was found in supertokens", userInfo);
        } catch (error) {
            if (error instanceof AppError) {
                // Re-throw custom errors (e.g., APIError, BadRequestError)
                throw error;
            }
            return ResponseHelper.error("Somenthing went wrong", error);
        }
    }

    async deleteUserById(userId) {
        try {
            const userInfo = await this.checkIfUserExistsInSuperTokens(userId);
            if (userInfo.success === false) {
                console.log("I am here");
                throw new AppError("Api Error", STATUS_CODES.INTERNAL_ERROR, "User not found", "User not found");
            }

            const deletedUser = await deleteUser(userId);
            console.log("User deleted successfully", deletedUser);
            return ResponseHelper.success("User deleted successfully", deletedUser);
        } catch (err) {
            // Throw again so the router can catch it
            throw err;
        }
    }



    async addRolesAndPermissionsToSession(session) {
        // we add the user's roles to the user's session
        await session.fetchAndSetClaim(UserRoleClaim);

        // we add the permissions of a user to the user's session
        await session.fetchAndSetClaim(PermissionClaim);
    }

    async addRoleToUser(userId, Role) {
        // capitalize the role name
        Role = Role.toUpperCase();
        // Check if the role exists
        console.log("this is the role ", Role);
        const response = await UserRoles.addRoleToUser("public", userId, Role);
        if (response.status === "UNKNOWN_ROLE_ERROR") {
            // No such role exists
            return;
        }

        if (response.didUserAlreadyHaveRole === true) {
            // The user already had the role
        }
        return true;
    }


}

export default AuthService;