import express from 'express';
import { logoutUser, registerUser, userLogin } from '../controllers/userControllers.js';
import {resendOTP, sendOTP} from "../controllers/otpController.js";

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp",resendOTP);


export default router;