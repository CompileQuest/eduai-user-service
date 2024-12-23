const UserRouterV1 = require('./v1/user');
const appEvent = require('./v1/app-events');
module.exports = (app) => {
    app.use('/api/v1/user', UserRouterV1); // Register version 1 routes
    // Add more versions or route groups as needed
    app.use('/api/v1/user', appEvent);
    
};
