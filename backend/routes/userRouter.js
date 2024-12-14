import express from 'express';
import { getUser, logoutUser, registerUser, signWithGoogle, updateUser, userLogin } from '../controllers/userControllers.js';
import {resendOTP, sendOTP, verifyOtp} from "../controllers/otpController.js";
import protect from '../middlewares/protect.js';
import { addAddress, deleteAddress, getAddress, updateAddress } from '../controllers/addressController.js';

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp", resendOTP);
router.post("/googlesign", signWithGoogle);

router.route("/user/:id").get(getUser)

router.put('/profile', protect('user'), updateUser)


router.route("/address/:id").post(addAddress).get(getAddress).delete(protect('user'), deleteAddress).put(protect('user'), updateAddress);

router.post("/verifyOtp",protect('user'),verifyOtp);



export default router;