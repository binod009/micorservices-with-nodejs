import express, { Request, Response } from "express";
import Router from "./routes/index";
import { connectDB } from "./db";

import CookieParser from "cookie-parser";
import GlobalErrorHandler from "./controller/error.controller";
import Cors from "cors";
const app = express();
const PORT = 3005;
connectDB();

app.use(CookieParser());
app.use(
  Cors({
    origin: "http://localhost:3007", // Or your frontend URL
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(Router);
app.use(GlobalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, from product app services");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
