import express from 'express';
import { getUser, logoutUser, registerUser, signWithGoogle, userLogin } from '../controllers/userControllers.js';
import {resendOTP, sendOTP} from "../controllers/otpController.js";
import protect from '../middlewares/protect.js';
import { addAddress, deleteAddress, getAddress } from '../controllers/addressController.js';

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp", resendOTP);
router.post("/googlesign", signWithGoogle);

router.route("/user/:id").get(getUser)

router.route("/address/:id").post(addAddress).get(getAddress).delete(protect('user'),deleteAddress);



export default router;