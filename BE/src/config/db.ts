import mongoose from "mongoose";

import { MONGO_URI } from "../constants/env";

const connectToDatabase = async () => {
    try {
        const dbName = "staking";  
        const mongoURIWithDB = `${MONGO_URI}${dbName}`;  
        await mongoose.connect(mongoURIWithDB);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

export default connectToDatabase;