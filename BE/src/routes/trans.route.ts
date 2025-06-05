import { Router } from "express";
import { getAllHandler, getUserTransactionsHandler, searchTransactionsHandler } from "../controllers/trans.controller";
import { authenticateToken } from "../middleware/authenToken";


const transRoutes = Router();

transRoutes.get("/getAll", authenticateToken, getAllHandler)
transRoutes.get("/getUser/:address", authenticateToken, getUserTransactionsHandler)
transRoutes.get("/search/:address", authenticateToken, searchTransactionsHandler)


export default transRoutes;
