import express from 'express';
import { logoutUser, registerUser, signWithGoogle, userLogin } from '../controllers/userControllers.js';
import {resendOTP, sendOTP} from "../controllers/otpController.js";

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp", resendOTP);
router.post("/googlesign",signWithGoogle);


export default router;