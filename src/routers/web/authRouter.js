import { Router } from 'express';

import AuthController from '../../controllers/AuthController.js';
import { isNotAuthenticated } from '../../middlewares/auth.js';

const router = Router();

router.get('/signup', isNotAuthenticated, AuthController.signup);
router.get('/signin', isNotAuthenticated, AuthController.signin);
router.get('/signout', AuthController.signout);

export default router;