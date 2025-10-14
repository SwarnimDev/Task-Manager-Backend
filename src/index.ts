import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("MongoDB + Node + TypeScript setup working!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
