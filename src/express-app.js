import express from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler.js';

import apiRoutes from './api/routes/index.js';


import supertokens from "supertokens-node";

import { middleware, errorHandler } from "supertokens-node/framework/express";
import { SuperTokensConfig } from "./config/superTokenConfig.js"

import path from "path";
import { fileURLToPath } from "url";
import { WEBSITE_DOMAIN } from "./config/index.js";

export default async (app) => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    // app.use(cors());
    app.use(express.static(new URL('./public', import.meta.url).pathname));

    // app.use((req, res, next) => {
    //     console.log(req);
    //     next();
    // });
    supertokens.init(SuperTokensConfig);

    app.use(
        cors({
            origin: WEBSITE_DOMAIN,
            allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
            methods: ["GET", "PUT", "POST", "DELETE"],
            credentials: true,
        })
    );



    // Listen to Events
    // API routes
    apiRoutes(app);
    // app.use(apiRoutes);  // All versioned routes are under /api

    // Initialize RabbitMQ (if needed)
    app.use(middleware());
    app.use(errorHandler());

    // Error handling
    app.use(HandleErrors);
};
