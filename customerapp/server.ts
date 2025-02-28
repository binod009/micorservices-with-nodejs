import express, { NextFunction } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./db";
import GlobalErrorHandler from "./controller/error.controller";
import Router from "./routes/index";
const PORT = 3006;
const app = express();


connectDB();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(Router);

app.use(GlobalErrorHandler);

app.use("/", (req, res, next) => {
  res.status(200).json({
    msg: "hello from customer services",
  });
});

app.listen(PORT, () => {
  console.log(`customer app Server running at http://localhost:${PORT}`);
});
