
const socialLoginOverride = (originalImplementation) => {
    return {
        ...originalImplementation,

        signInUp: async function (input) {
            // TODO: Some pre-sign-in/up logic (e.g., logging, validation)

            let response = await originalImplementation.signInUp(input);

            if (response.status === "OK") {
                const provider = response.user.loginMethods[0].thirdPartyId;

                if (provider === "google") {
                    let accessToken = response.oAuthTokens["access_token"];
                    let firstName = response.rawUserInfoFromProvider.fromUserInfoAPI["first_name"];
                    console.log(`Signed in via Google: ${firstName}`);
                } else if (provider === "github") {
                    let accessToken = response.oAuthTokens["access_token"];
                    let username = response.rawUserInfoFromProvider.fromUserInfoAPI["login"];
                    console.log(`Signed in via GitHub: ${username}`);
                }

                if (input.session === undefined) {
                    if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
                        console.log('New user signed up');
                    } else {
                        console.log('Existing user signed in');
                    }
                }
            }

            return response;
        },
    };
};


export { socialLoginOverride };
