import express from "express";
import { addBrand, authAdmin, blockUser, deleteBrand, deleteUser, getAllBrand, getAllUsers, logoutAdmin, registerAdmin } from "../controllers/adminControllers.js";
import { addCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryController.js";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateImages, updateProduct } from "../controllers/productControllers.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post('/login', authAdmin);
router.post('/logout', logoutAdmin);
router.get('/users', getAllUsers);
router.delete("/user/:id", deleteUser);
router.put("/user/:id", blockUser);

//brand routers
router.route('/brand').post(addBrand).get(getAllBrand)

//special brand routes

router.route("/brand/:id").delete(deleteBrand);


//category related routes
router.route('/category').post(addCategory).get(getAllCategory)

//specific category manage
router.route('/category/:id').delete(deleteCategory).put(updateCategory);

//product related routes
router.route("/product").post(addProduct).get(getAllProducts);
router.route("/product/:id").get(getProduct).delete(deleteProduct).put(updateProduct);

router.route("/product-images/:id").put(updateImages);


//category related routes

router.route('/category').get(getAllCategory);

export default router;