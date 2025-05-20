import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import blogRouter from './routes/blog.js';
import { connectRabbitMQ } from './utils/rabbitmq.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())

connectRabbitMQ();

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRECT 
    });

app.use(express.json());
app.use("/api/v1", blogRouter);



const port = process.env.PORT || 5001;
initDB().then(() => {
      app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
      })
})
