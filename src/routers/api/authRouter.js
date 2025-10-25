import { Router } from 'express';
import AuthController from '../../controllers/AuthController.js';
const router = Router()

router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);

export default router;