import express from "express";
import {signup,login,logout,checkAuth} from "../controllers/captainAuth.controller.js";
import {CaptainprotectRoute} from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/logout",logout);
router.get("/check",CaptainprotectRoute,checkAuth);


export default router;