import express from 'express';
import { changePassword, forgotPassword, getUser, logoutUser, registerUser, signWithGoogle, updateUser, uploadProfileUrl, userLogin } from '../controllers/userControllers.js';
import {resendOTP, resendOtpEamil, sendOTP, sendOTPToEmail, verifyOtp} from "../controllers/otpController.js";
import protect from '../middlewares/protect.js';
import { addAddress, deleteAddress, getAddress, updateAddress } from '../controllers/addressController.js';
import { addToCart, cartCount, deleteFromCart, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { addOrder, getAllOrdersWithEachProducts, getOrder, getOrdersWithSingleProducts, updateOrderStatus } from '../controllers/orderController.js';
import { savePayment, verifyPayment } from '../controllers/paymentController.js';
import { addAllToCart, getAllWishListProducts, removeFromWishlist, toggleWishList } from '../controllers/wishListController.js';
import { applyCoupon, getAllApplicableCoupons } from '../controllers/couponController.js';
import { addAmountToWallet, getOrCreateWallet, processTransaction } from '../controllers/walletController.js';
import { addToFailedOrders } from '../controllers/failedOrderController.js';
import { getSalesAnalytics } from '../controllers/salesController.js';
import { addReview, getAReview, productReview } from '../controllers/reviewController.js';
import { createReferralCode, getUserReferrals } from '../controllers/referralController.js';

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
router.put("/verifyPayment", protect("user"), verifyPayment);


//wishlist

router
  .route("/wishlist")
  .patch(protect("user"), toggleWishList)
  .get(protect("user"), getAllWishListProducts).delete(protect('user'), removeFromWishlist).put(protect('user') , addAllToCart);


router.route('/coupon').post(protect('user'), applyCoupon)

//wallet related

router
  .route("/wallet")
  .get(protect("user"), getOrCreateWallet)
  .post(protect("user"), addAmountToWallet)
  .put(protect("user"), processTransaction);


router.post("/allCoupon", protect("user"), getAllApplicableCoupons);


router.route("/failedOrder").post(protect("user"), addToFailedOrders);

//review section
router.route("/review").post(protect("user"), addReview);
router.get("/getAReview/:id", protect("user"), getAReview);
router.get("/productReview/:id", protect("user"), productReview);



router.get("/cartCount", protect("user"), cartCount);


//referral related
router
  .route("/referral")
  .post(protect("user"), createReferralCode)
  .get(protect("user"), getUserReferrals);

export default router;