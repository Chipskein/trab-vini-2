import { Router } from "express";

import uploadMiddleware from '../../middlewares/multer.js';

import PostsController from "../../controllers/PostsController.js";

const router = Router();

router.post("/", uploadMiddleware.single('image'), PostsController.savePost);
router.get("/:postId", PostsController.get);

export default router;