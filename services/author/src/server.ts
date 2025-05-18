import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import blogRouter from './routes/blog.js';

dotenv.config();
const app = express();


app.use(express.json());
app.use("/api/v1", blogRouter);

const port = process.env.PORT || 5001;
initDB().then(() => {
      app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
      })
})
