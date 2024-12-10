import express from 'express';
import { logoutUser, registerUser, userLogin } from '../controllers/userControllers.js';
import {sendOTP} from "../controllers/otpController.js";

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 


export default router;