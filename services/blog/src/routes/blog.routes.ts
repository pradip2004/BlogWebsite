import express from 'express';
import { getAllBlogs, getBlogById } from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/blog/all', getAllBlogs);
router.get('/blog/:id', getBlogById);

export default router;