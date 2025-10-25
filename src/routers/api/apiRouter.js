import { Router } from "express";

import { isAuthenticated,isNotAuthenticated } from '../../middlewares/auth.js';

import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";

const router = Router();

router.use('/auth', isNotAuthenticated, authRouter);
router.use('/users',usersRouter);

router.use('/posts',isAuthenticated, postsRouter);

export default router;