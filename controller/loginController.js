const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const user_svc = require("../services/userServices");
require("dotenv").config();
exports.signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hash(password, 10);
  // Insert user into the database
  const result = await pool.query(
    "INSERT INTO login (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  res.status(201).json({
    msg: "created successfully",
    result: result.rows[0],
  });
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await user_svc.getUserByEmail(email);
  if (rows.length > 0) {
    const comparePassword = bcrypt.compare(password, rows[0].password);
    if (comparePassword) {
      const payload = { id: rows[0].id, username: rows[0].username };
      
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1m",
      });
      //refreshtoken for generating new accesstoken after accessToken expires
      const refreshToken = jwt.sign(
        { id: rows[0].id, username: rows[0].username },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.cookie("reftok", refreshToken, { httpOnly: true });
      res.status(200).json({
        msg: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } else {
    throw new ApiError("Email address didnot matched", 400);
  }
});
