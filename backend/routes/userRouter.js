import express from 'express';
import { getUser, logoutUser, registerUser, signWithGoogle, updateUser, uploadProfileUrl, userLogin } from '../controllers/userControllers.js';
import {resendOTP, sendOTP} from "../controllers/otpController.js";
import protect from '../middlewares/protect.js';
import { addAddress, deleteAddress, getAddress, updateAddress } from '../controllers/addressController.js';

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp", resendOTP);
router.post("/googlesign", signWithGoogle);

router.route("/profile").get(protect("user"), getUser);

router.put('/profile', protect('user'), updateUser)

//user Profile image related
router.put("/profileImage", protect("user"), uploadProfileUrl);


router.route("/address/:id").post(addAddress).get(getAddress).delete(protect('user'), deleteAddress).put(protect('user'), updateAddress)



export default router;