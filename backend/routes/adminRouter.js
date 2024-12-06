import express from "express";
import { addBrand, authAdmin, blockUser, deleteBrand, deleteUser, getAllBrand, getAllUsers, logoutAdmin, registerAdmin } from "../controllers/adminControllers.js";

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



export default router;