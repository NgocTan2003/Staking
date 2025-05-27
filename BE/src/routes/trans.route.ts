import { Router } from "express";
import { getAllHandler, getUserTransactionsHandler } from "../controllers/trans.controller";



const transRoutes = Router();

transRoutes.get("/getAll", getAllHandler)
transRoutes.get("/getUser/:address", getUserTransactionsHandler)


export default transRoutes;
