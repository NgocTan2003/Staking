import "dotenv/config"
import express from "express";
import connectToDatabase from "./config/db";
import cors from "cors";
import { APP_ORIGIN, PORT } from "./constants/env";
import transRoutes from "./routes/trans.route";
import { getTransactions } from "./crawl/crawlTransaction";
import { setInterval } from "timers";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);

app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        express.json()(req, res, next);
    } else {
        next();
    }
});

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World! 123");
});

app.use("/api/transactions", transRoutes)
app.use("/api/auth", authRoutes)

setInterval(() => {
    getTransactions().then(() => {
        console.log("Crawling transactions completed successfully.");
    }).catch((error) => {
        console.error("Error during crawling transactions:", error);
    });
}, 20000);


app.listen(Number(PORT), "0.0.0.0", async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDatabase();
});