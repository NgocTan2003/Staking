import "dotenv/config"
import express from "express";
import connectToDatabase from "./config/db";
import cors from "cors";
import { APP_ORIGIN, PORT } from "./constants/env";
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);


app.get("/", (req, res) => {
    res.send("Hello World! 123");
});


app.listen(Number(PORT), "0.0.0.0", async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDatabase();
});