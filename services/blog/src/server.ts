import express from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.routes.js';
import { connectRedis } from './utils/redisConfig.js';
import cors from 'cors';
import { startCacheConsumer } from './utils/consumer.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())

startCacheConsumer();
connectRedis();
app.use("/api/v1", blogRoutes)

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
      console.log(`Blog service is running on port ${PORT}`);
});
