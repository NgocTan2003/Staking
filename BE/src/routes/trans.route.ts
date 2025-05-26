import { Router } from "express";
import { getAllHandler, getUserTransactions } from "../controllers/trans.controller";



const transRoutes = Router();

transRoutes.get("/getAll", getAllHandler)
transRoutes.get("/getUserTransactions", getUserTransactions)


export default transRoutes;
