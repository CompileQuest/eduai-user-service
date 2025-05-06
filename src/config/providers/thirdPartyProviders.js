import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET
} from '../index.js';

const thirdPartyProviders = [
    {
        config: {
            thirdPartyId: "google",
            clients: [
                {
                    clientId: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                },
            ],
        },
    },
    {
        config: {
            thirdPartyId: "github",
            clients: [
                {
                    clientId: GITHUB_CLIENT_ID,
                    clientSecret: GITHUB_CLIENT_SECRET,
                },
            ],
        },
    },
    {
        config: {
            thirdPartyId: "twitter",
            clients: [
                {
                    clientId: TWITTER_CLIENT_ID,
                    clientSecret: TWITTER_CLIENT_SECRET,
                },
            ],
        },
    },
];

export {
    thirdPartyProviders
}
