import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema,loginSchema } from '../validators/authValidators.js';
const authRouter=express.Router();

//POST /api/auth/singup
authRouter.post('/signup',validateRequest(registerSchema),registerUser);

//POST /api/auth/login
authRouter.post('/login',validateRequest(loginSchema),loginUser);

export default authRouter;