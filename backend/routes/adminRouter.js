import express from "express";
import { addBrand, authAdmin, blockUser, deleteBrand, deleteUser, getAllBrand, getAllUsers, logoutAdmin, registerAdmin } from "../controllers/adminControllers.js";
import { addCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryController.js";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateImages, updateProduct } from "../controllers/productControllers.js";
import protect from "../middlewares/protect.js";
import { getUser } from "../controllers/userControllers.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post('/login', authAdmin);
router.post('/logout', logoutAdmin);
router.get('/users',protect('admin'), getAllUsers);
router.delete("/user/:id", protect("admin"), deleteUser);
router.put("/user/:id", protect("admin"), blockUser);

//brand routers
router.route('/brand').post(protect('admin'),addBrand).get(protect('admin'),getAllBrand)

//special brand routes

router.route("/brand/:id").delete(protect('admin'),deleteBrand);


//category related routes
router.route('/category').post(protect('admin'),addCategory).get(protect('admin'),getAllCategory)

//specific category manage
router.route('/category/:id').delete(protect('admin'),deleteCategory).put(protect('admin'),updateCategory);

//product related routes
router.route("/product").post(protect('admin'),addProduct).get(protect('admin'),getAllProducts);
router.route("/product/:id").get(protect('admin'),getProduct).delete(protect('admin'),deleteProduct).put(protect('admin'),updateProduct);

router.route("/product-images/:id").put(protect('admin'),updateImages);

//user related routes





export default router;