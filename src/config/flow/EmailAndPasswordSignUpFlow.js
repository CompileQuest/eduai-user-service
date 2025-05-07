import {
    extractFormFields,
} from "../../utils/index.js";
import AuthService from "../../services/auth-service.js";
import HttpClient from "../../services/external/httpClient.js";
import { FormateData } from "../../utils/index.js";
const authService = new AuthService();
const httpClient = new HttpClient();
export const EmailAndPasswordSignUpFlow = async (originalImplementation, input) => {
    const formData = extractFormFields(input.userContext);

    if (!formData) {
        console.error("Form fields are missing in the request");
        return {
            status: "GENERAL_ERROR",
            message: "Form fields are missing in the request.",
        };
    }

    console.log("Form data extracted from the request:", formData);

    const userNamePayload = FormateData(formData.username);

    const usernameExit = await authService.userExitsInUserService(userNamePayload);





    // Sign up with SuperTokens Core
    let response = await originalImplementation.signUp(input);

    if (response.status !== "OK") return response;

    const userId = response.user.id;

    // Assign role to the user
    const roleAdded = await authService.addRoleToUser(userId, formData.role);
    if (!roleAdded) {
        console.error("Failed to assign role to the user");
    }

    // Add roles and permissions to session if a session exists
    if (input.session) {
        try {
            await authService.addRolesAndPermissionsToSession(input.session);
            console.log("Roles and permissions added to session");
        } catch (err) {
            console.error("Failed to add roles and permissions to session:", err);
        }
    }

    // Create a payload for the event
    const formDataWithUserId = {
        ...formData,
        userId: userId,
        emailVerified: response.user.loginMethods[0].verified,
        userTimeJoined: response.user.timeJoined,
    };

    // Publish user signup event using message broker !!



    // Create the user in the user service !!!
    try {
        const userServiceResponse = await authService.createUserInUserService(formDataWithUserId);
        // There was a problem creating the user in the user service !!! 
        // Delete the user from the auth Service 
        if (userServiceResponse.statusCode !== 200) {
            // Delete the user from the auth service
            const deleteUserResponse = await authService.deleteUserById(userId);
        }

        console.log("User created in user service successfully:", userServiceResponse);

    } catch (error) {
        throw error
    }









    console.log("User signed up successfully with roles and session claims updated.");
    return response;
};
