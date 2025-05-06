import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/index.js';




// Todo I need to add a retry mechanism here ( Expenontial Backoff or Circuit Break).
const DatabaseConnection = async () => {
    try {
        await mongoose.connect(MONGODB_URI); // ← Clean, modern syntax
        console.log('✅ Db Connected');
    } catch (error) {
        console.error('❌ Error connecting to DB:', error);
        process.exit(1);
    }
};

export default DatabaseConnection;
