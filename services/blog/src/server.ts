import express from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.routes.js';
import { connectRedis } from './utils/redisConfig.js';


dotenv.config();
const app = express();


connectRedis();
app.use("/api/v1", blogRoutes)

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
      console.log(`Blog service is running on port ${PORT}`);
});
