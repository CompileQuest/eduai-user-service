import mongoose from 'mongoose';
import { DB_URL } from '../config/index.js';

const connectDB = async () => {
    try {
        console.log("this is the db_url ", DB_URL);
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Db Connected');
    } catch (error) {
        console.log('Error ============');
        console.log(error);
        console.log("yah here is the error man");
        process.exit(1);
    }
};

export default connectDB;