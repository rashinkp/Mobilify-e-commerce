import express from "express";
import { authAdmin, deleteUser, getAllUsers, logoutAdmin, registerAdmin } from "../controllers/adminControllers.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post('/login', authAdmin);
router.post('/logout', logoutAdmin);
router.get('/users', getAllUsers);
router.delete("/user/:id", deleteUser);



export default router;