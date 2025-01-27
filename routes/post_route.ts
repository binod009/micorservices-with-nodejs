const express = require("express");
import { createPost, getAllPost } from "../controller/postController";
import {verifyToken}  from "../middleware/authMiddleware";
const post_routes = express.Router();

post_routes
  .post("/post", verifyToken, createPost)
  .get("/post", verifyToken, getAllPost);

export default post_routes;
