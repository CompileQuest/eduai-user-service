export async function addCustomClaimsToSession(userId, session) {
    // Fetch any additional user data you need from your database
    const userData = await authService.getUserData(userId);

    if (userData) {
        await session.updateAccessTokenPayload({
            username: userData.username,
            email: userData.email,
            // other custom claims
        });
    }
}