import express from "express";
import {
  addBrand,
  authAdmin,
  blockUser,
  deleteBrand,
  getAllBrand,
  getAllUsers,
  logoutAdmin,
  registerAdmin,
} from "../controllers/adminControllers.js";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateImages,
  updateProduct,
} from "../controllers/productControllers.js";
import protect from "../middlewares/protect.js";
import { getUser } from "../controllers/userControllers.js";
import {
  getAllOrders,
  getAOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import optionalProtect from "../middlewares/optionalProtect.js";
import { AddCoupon, editCoupon, getACoupon, getAllCoupon, updateApplicables } from "../controllers/couponController.js";
import { getSales } from "../controllers/salesController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", authAdmin);
router.post("/logout", logoutAdmin);
router.get("/users", protect("admin"), getAllUsers);
router.put("/user/:id", protect("admin"), blockUser);

//brand routers
router
  .route("/brand")
  .post(protect("admin"), addBrand)
  .get(protect("admin"), getAllBrand);

//special brand routes

router.route("/brand/:id").delete(protect("admin"), deleteBrand);

//category related routes
router
  .route("/category")
  .post(protect("admin"), addCategory)
  .get(protect("admin"), getAllCategory);

//specific category manage
router
  .route("/category/:id")
  .delete(protect("admin"), deleteCategory)
  .put(protect("admin"), updateCategory);

//product related routes
router
  .route("/product")
  .post(protect("admin"), addProduct)
  .get(optionalProtect("user"), getAllProducts);
router
  .route("/product/:id")
  .get(optionalProtect("user"), getProduct)
  .delete(protect("admin"), deleteProduct)
  .put(protect("admin"), updateProduct);

router.route("/product-images/:id").put(protect("admin"), updateImages);

//order related routes

router
  .route("/order")
  .get(protect("admin"), getAllOrders)
  .patch(protect("admin"), updateOrderStatus);

router.route("/order/:id").get(protect("admin"), getAOrder);

//coupon related routes

router
  .route("/coupon")
  .post(protect("admin"), AddCoupon)
  .get(protect("admin"), getAllCoupon)
  .put(protect("admin"), editCoupon)
  .patch(protect('admin'), updateApplicables);



router.get('/coupon/:id', protect('admin'), getACoupon);

//sales related

router.route("/sales").get(protect("admin"), getSales);

export default router;
