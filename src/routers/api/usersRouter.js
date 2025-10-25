import { Router } from "express";

import AuthController from "../../controllers/AuthController.js";

import {  isNotAuthenticated } from "../../middlewares/auth.js";

const router = Router();

router.post('/', isNotAuthenticated, AuthController.signup);

export default router;

