import express from 'express';
import { logoutUser, registerUser, userLogin } from '../controllers/userControllers.js';


const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


export default router;