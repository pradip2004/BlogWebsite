import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.route.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRECT 
    });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
      connectDB();
      console.log(`Server is running on port ${PORT}`);
})