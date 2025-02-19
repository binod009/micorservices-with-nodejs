import express from "express";
import { refreshToken } from "../controller/auth.controller";

const auth_route= express.Router();

auth_route.get("/refresh",refreshToken);

export default auth_route;