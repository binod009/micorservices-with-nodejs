import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import Routes from "./routes/index";
import globalErrorHandler from "./controller/errorController";
import LoginModelRegistery from "./models/login.model";
import Database from "./db";
import ConnectRedis from "./utils/redisClient";
const DB = new Database();
const CR = ConnectRedis.getInstance();
const PORT: number = 3003;
  const app: Application = express();
   DB.connectDB();
CR.connectRedis();
CR.checkStore();
  // Middleware 
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Routes
    app.use(Routes);
  
    // Global Error Handler
    app.use(globalErrorHandler);
    app.use("/", (req: Request, res: Response) => {
      res.status(200).json({
        msg: "hello from authapp services",
      });
    });

    // Start Server
    app.listen(PORT, () => {
      console.log("server is listening...");
    });
  


