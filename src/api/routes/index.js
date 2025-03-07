import UserRouterV1 from './v1/user.js';
import appEventRouterV1 from './v1/app-events.js';

export default (app) => {
    app.use('/api/v1/user', UserRouterV1);
    app.use('/api/v1/user/app-events', appEventRouterV1); // Corrected route path.
};