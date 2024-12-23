const express = require('express');
const cors = require('cors');
const { UserRouter } = require('./api/routes');
const HandleErrors = require('./utils/error-handler')
//const appEvent = require('./api/routes/app-events')
const appEvent = require('./api/routes/v1/app-events')
const apiRoutes = require('./api/routes/index')

module.exports = async (app) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    // app.use(cors());
    app.use(express.static(__dirname + '/public'))

    // app.use((req,res,next)=>{
    //     console.log(req);
    //     next();
    // })
    // Listen to Events
    //api
    apiRoutes(app);
    //app.use( apiRoutes);  // All versioned routes are under /api

    // initialize the rabbit mq 


    // error handling
    app.use(HandleErrors);

}