import { Router } from 'express';

import authRouter from './authRouter.js';
import userRouter from './usersRouter.js';
import postsRouter from './postsRouter.js';

import { isAuthenticated } from '../../middlewares/auth.js';

const router = Router();

router.use("/auth", authRouter);
router.use("/users", isAuthenticated, userRouter);
router.use("/posts", isAuthenticated, postsRouter);

export default router;