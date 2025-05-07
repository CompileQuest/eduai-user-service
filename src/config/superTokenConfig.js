import { SignUpFormFields } from './GeneralConfigs/formFieldsConfig.js';
import { emailAndPasswordOverride } from './overrides/emailAndPasswordOverride.js';
import { socialLoginOverride } from './overrides/socialLoginOverride.js';
import { thirdPartyProviders } from './providers/thirdPartyProviders.js';
import {
    SUPERTOKEN_CONNECTION_URL,
    SUPERTOKEN_API_KEY,
    WEBSITE_DOMAIN,
    API_DOMAIN
} from "./index.js";

import EmailPassword from "supertokens-node/recipe/emailpassword";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailVerification from "supertokens-node/recipe/emailverification";
import UserService from '../services/user-service.js';

const userService = new UserService();

export const SuperTokensConfig = {
    supertokens: {
        connectionURI: SUPERTOKEN_CONNECTION_URL,
        apiKey: SUPERTOKEN_API_KEY,
    },
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: API_DOMAIN,
        websiteDomain: WEBSITE_DOMAIN,
        apiBasePath: '/api/v1/user/auth',
    },
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
                formFields: SignUpFormFields,
                apiPath: "hello/signup"
            },
            override: {
                functions: emailAndPasswordOverride,
            },
        }),
        ThirdParty.init({
            override: {
                functions: socialLoginOverride,
            },
            signInAndUpFeature: {
                providers: thirdPartyProviders,
            },
        }),
        EmailVerification.init({ mode: "OPTIONAL" }),

        Session.init({
            override: {
                functions: (originalImplementation) => ({
                    ...originalImplementation,

                    createNewSession: async function (input) {
                        let customPayload = input.accessTokenPayload || {};

                        try {
                            const userData = await userService.findUserById(input.userId);
                            if (userData) {
                                customPayload = {
                                    ...customPayload,
                                    username: userData.username,
                                    email: userData.email,
                                    // add more claims if needed
                                };
                            }
                        } catch (error) {
                            console.error("Failed to fetch user data for access token payload:", error);
                        }

                        return originalImplementation.createNewSession({
                            ...input,
                            accessTokenPayload: customPayload
                        });
                    },

                    refreshSession: async function (input) {
                        // Refresh keeps the same payload, unless you want to regenerate custom claims
                        return originalImplementation.refreshSession(input);
                    },
                })
            }
        }),

        Dashboard.init(),
        UserRoles.init(),
    ],
};
