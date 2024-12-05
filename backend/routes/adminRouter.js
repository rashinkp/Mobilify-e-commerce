import express from "express";
import { authAdmin, registerAdmin } from "../controllers/adminControllers.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post('/login',authAdmin)



export default router;