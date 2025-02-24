import express, { Router } from "express";
import { signUp, signIn } from "../controller/loginController";
import { verifyToken } from "../middleware/authMiddleware";
import { activeRegisterUser } from "../controller/authController";
import { generateAccessToken } from "../controller/authController";
import { apiEventController } from "../controller/api/apiEventController";
const auth_route: Router = express.Router();

auth_route.post("/signup", signUp);
auth_route.post("/signin", signIn);
auth_route.get("/reftoken", generateAccessToken);
auth_route.get("/verify-email", activeRegisterUser);
auth_route.get("/api-event/user",verifyToken,apiEventController)

export default auth_route;
