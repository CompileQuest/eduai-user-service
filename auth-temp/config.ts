import ThirdParty from "supertokens-node/recipe/thirdparty";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailVerification from "supertokens-node/recipe/emailverification";

export function getApiDomain() {
    const apiPort =  8000;
    const apiUrl = `http://localhost:${apiPort}`;
    return apiUrl;
}  
export function getWebsiteDomain() {
    const websitePort =  3000;
    const websiteUrl = `http://localhost:${websitePort}`;
    return websiteUrl;
}
export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://st-dev-33e43990-a1cc-11ef-bf24-a923520d8a44.aws.supertokens.io",
        apiKey: "yN-XSzPvfJQ4W-j1p6ymgxFwkj"
    },
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    // We have provided you with development keys which you can use for testing.
                    // IMPORTANT: Please replace them with your own OAuth keys for production use.
                    {
                        config: {
                            thirdPartyId: "google",
                            clients: [
                                {
                                    clientId:
                                        "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                    clientSecret: "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",
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "github",
                            clients: [
                                {
                                    clientId: "467101b197249757c71f",
                                    clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "apple",
                            clients: [
                                {
                                    clientId: "4398792-io.supertokens.example.service",
                                    additionalConfig: {
                                        keyId: "7M48Y4RYDL",
                                        privateKey:
                                            "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                        teamId: "YWQCXGJRJL",
                                    },
                                },
                            ],
                        }, 
                    },
                    {
                        config: {
                            thirdPartyId: "twitter",
                            clients: [
                                {
                                    clientId: "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
                                    clientSecret: "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
                                },
                            ],
                        },
                    },
                ],
            },
        }),
        EmailVerification.init({
            mode: "REQUIRED", // or "OPTIONAL"
          }), 
        Session.init(),
        Dashboard.init(),
        UserRoles.init(), 
    ],
};
