import { Router } from "express";
import { getSignatureHandler, loginHandler, refreshTokenHandler } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenToken";


const authRoutes = Router();

authRoutes.get("/getSignature", getSignatureHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/refreshToken", refreshTokenHandler);

export default authRoutes;
