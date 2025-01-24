const express = require("express");
const { createPost, getAllPost } = require("../controller/postController");
const { verifyToken } = require("../middleware/authMiddleware");
const post_routes = express.Router();

post_routes
  .post("/post", verifyToken, createPost)
  .get("/post", verifyToken, getAllPost);

module.exports = post_routes;
