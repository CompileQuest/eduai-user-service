import UserRouterV1 from './v1/user.js';
import AuthRouterV1 from './v1/auth.js'
import appEventRouterV1 from './v1/app-events-auth.js';
import appEventsUserRouterV1 from './v1/app-events-user.js'
export default (app) => {
    app.use('/api/v1/user', UserRouterV1);
    app.use('/api/v1/auth', AuthRouterV1);
    app.use('/api/v1/user/app-events', appEventsUserRouterV1); // Corrected route path.
    app.use('/api/v1/auth/app-events', appEventRouterV1); // Corrected route path.

};