// todo : routes => controller => service => repository 
// todo : unit testing for each layer 


import express from 'express';
import { PORT } from './config/index.js';
import DatabaseConnection from './database/connection.js';
import expressApp from './express-app.js';
//import RabbitMQClient from './infrastructure/messageQueue/fireAndForget/RabbitMQClient.js';


const StartServer = async () => {

    const app = express();

    await DatabaseConnection();
    //   RabbitMQClient.initialize();

    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })
}

StartServer();