import { Router } from 'express';
import UsersController from '../../controllers/UsersController.js';

const router = Router();

router.get('/feed',UsersController.feed);

export default router;