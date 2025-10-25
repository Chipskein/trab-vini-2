import { Router } from "express";

import PostsController from '../../controllers/PostsController.js'

const router = Router();

router.get("/", PostsController.savePost);
router.get("/:postId", PostsController.get);

export default router;