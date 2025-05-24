import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { aiBlogResponse, aiDescResponse, aiTitleResponse, createBlog, deleteBlog, updateBlog } from '../controllers/blog.js';

const router = express.Router();

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);
router.post("/ai/title", aiTitleResponse);
router.post("/ai/desc", aiDescResponse);
router.post("/ai/blog", aiBlogResponse);

export default router;