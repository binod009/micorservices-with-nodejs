import express, { Router } from "express";
import { signUp, signIn } from "../controller/loginController";
import { verifyToken } from "../middleware/authMiddleware";
import { activeRegisterUser } from "../controller/authController";
import { generateAccessToken } from "../controller/authController";
import { Application } from "express";
const auth_route: Router = express.Router();

auth_route.post("/signup", signUp);
auth_route.post("/signin", signIn);
auth_route.get("/reftoken", generateAccessToken);
auth_route.get("/verify-email", activeRegisterUser);

export default auth_route;
