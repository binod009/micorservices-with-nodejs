const ApiError = require("../utils/ApiError");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");

exports.verifyToken = asyncHandler(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization || req.headers["x-xsrf-token"]) {
    token = req.headers.authorization || req.headers["x-xsrf-token"];
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    throw new ApiError("token not provided", 401);
  } else {
    const token_split = token.split(" ");
    token = token_split.pop();
    if (!token) {
      throw new ApiError("invalid token", 401);
    } else {
      const authUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.authUser;
      next();
    }
  }
});
