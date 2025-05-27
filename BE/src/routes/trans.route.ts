import { Router } from "express";
import { getAllHandler, getUserTransactionsHandler, searchTransactionsHandler } from "../controllers/trans.controller";



const transRoutes = Router();

transRoutes.get("/getAll", getAllHandler)
transRoutes.get("/getUser/:address", getUserTransactionsHandler)
transRoutes.get("/search/:address", searchTransactionsHandler)


export default transRoutes;
