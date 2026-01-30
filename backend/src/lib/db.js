import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}