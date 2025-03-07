import express from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler.js';
// import appEvent from './api/routes/app-events.js';
import appEvent from './api/routes/v1/app-events.js';
import apiRoutes from './api/routes/index.js';

export default async (app) => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    // app.use(cors());
    app.use(express.static(new URL('./public', import.meta.url).pathname));

    // app.use((req, res, next) => {
    //     console.log(req);
    //     next();
    // });

    // Listen to Events
    // API routes
    apiRoutes(app);
    // app.use(apiRoutes);  // All versioned routes are under /api

    // Initialize RabbitMQ (if needed)

    // Error handling
    app.use(HandleErrors);
};
