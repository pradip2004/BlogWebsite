import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/v1", userRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
      connectDB();
      console.log(`Server is running on port ${PORT}`);
})