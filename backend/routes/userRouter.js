import express from 'express';
import { changePassword, forgotPassword, getUser, logoutUser, registerUser, signWithGoogle, updateUser, uploadProfileUrl, userLogin } from '../controllers/userControllers.js';
import {resendOTP, resendOtpEamil, sendOTP, sendOTPToEmail, verifyOtp} from "../controllers/otpController.js";
import protect from '../middlewares/protect.js';
import { addAddress, deleteAddress, getAddress, updateAddress } from '../controllers/addressController.js';
import { addToCart, deleteFromCart, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { addOrder, getAllOrdersWithEachProducts, getOrder, getOrdersWithSingleProducts, updateOrderStatus } from '../controllers/orderController.js';
import { savePayment, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();



router.post("/register", registerUser);
router.post('/login', userLogin);
router.post("/logout", logoutUser);


router.post("/getotp", sendOTP); 
router.post("/resendotp", resendOTP);
router.post("/googlesign", signWithGoogle);

router.put("/changePassword",protect('user'),changePassword);

router.route("/profile").get(protect("user"), getUser);

router.put('/profile', protect('user'), updateUser)

//user Profile image related
router.put("/profileImage", protect("user"), uploadProfileUrl);


router
  .route("/address")
  .post(protect("user"), addAddress)
  .get(protect("user"), getAddress)
  .put(protect("user"), updateAddress);

router.delete('/address/:id',protect("user"), deleteAddress)

router.post('/otpToEmail', sendOTPToEmail);
router.post('/verifyOtp', verifyOtp);

router.put('/forgotPassword', forgotPassword)
router.post("/resendOtpEmail", resendOtpEamil);


router.route('/cart').post(protect('user'), addToCart).get(protect('user'), getCart).put(protect('user'), deleteFromCart).patch(protect('user'), updateCartQuantity);


//order related routes

router
  .route("/order")
  .post(protect("user"), addOrder)
  .get(protect("user"), getAllOrdersWithEachProducts).patch(protect('user'),updateOrderStatus);

router
  .get("/order/:id", protect("user"), getOrder)
  

  router.get(
    "/order/:ordId",
    protect("user"),
    getOrdersWithSingleProducts
);
  

router.post("/savePayment" , protect('user') , savePayment);
router.put("/updatePayment", protect("user"), verifyPayment);



export default router;