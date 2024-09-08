import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "./service/database";
import MainRouter from "./api";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

/**
 * Database instance (mock)
 * In a real production environment, we would use SQL or NoSQL to store our data.
 */
export const DB = new Database();

// Main router
app.use(cors());
app.use(express.json());
app.use(MainRouter);

if (process.env.NODE_ENV !== "test") {
  app
    .listen(PORT, () => {
      console.log("Server running on PORT:", PORT);
    })
    .on("error", (error) => {
      throw new Error(error.message);
    });
}
