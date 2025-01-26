const express = require("express");
const { signUp, signIn} = require("../controller/loginController");
const { verifyToken } = require("../middleware/authMiddleware");
const { activeRegisterUser }= require("../controller/authController");
const { generateAccessToken } = require("../controller/authController");
const auth_route = express.Router();

auth_route.post("/signup", signUp);
auth_route.post("/signin", signIn);
auth_route.get("/reftoken", generateAccessToken);
auth_route.post("/verify-email", activeRegisterUser);

module.exports = auth_route;
