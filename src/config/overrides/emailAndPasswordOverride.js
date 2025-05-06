import { EmailAndPasswordSignUpFlow } from "../flow/EmailAndPasswordSignUpFlow.js";
const emailAndPasswordOverride = (originalImplementation) => {
    return {
        ...originalImplementation,
        signUp: async function (input) {
            return await EmailAndPasswordSignUpFlow(originalImplementation, input);
        },
    };
};

export { emailAndPasswordOverride };
