import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import Routes from "./routes/index";
import globalErrorHandler from './controller/errorController';


const PORT: number = 3000;

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(Routes);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log("server is listening...");
});

export default server;
