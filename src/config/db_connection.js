import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const ENVIRONMENT = {
  DB_MONGO_STRING_CONNECTION: process.env.DB_MONGO_STRING_CONNECTION,
};

export const db_connection = async () => {
  mongoose
    .connect(ENVIRONMENT.DB_MONGO_STRING_CONNECTION)
    .then(() => console.log("Connected!"));
};
